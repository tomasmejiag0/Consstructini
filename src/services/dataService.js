import { supabase } from '@/lib/supabaseClient';

    const handleSupabaseError = (error, context) => {
      console.error(`Supabase error in ${context}:`, error.message, error.details || error.stack || error);
      if (error.message === "TypeError: Failed to fetch") {
        throw new Error("Network error: Could not connect to Supabase. Please check your internet connection and CORS settings.");
      }
      throw error;
    };

    export const fetchAllProjects = async () => {
      try {
        // First fetch all projects
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*');
        
        if (projectsError) throw projectsError;

        // Then fetch all managers
        const { data: managers, error: managersError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'project_manager');

        if (managersError) throw managersError;

        // Create a map of manager IDs to names
        const managerMap = new Map(managers.map(m => [m.id, m.name]));

        // Combine the data and ensure location_name is available (for consistency)
        const projectsWithManagerName = projects.map(project => ({
          ...project,
          manager: managerMap.get(project.manager_id) || 'Unassigned',
          // Ensure location_name exists (it should from DB, but add fallback for compatibility)
          location_name: project.location_name || project.locationName || ''
        }));

        return projectsWithManagerName || [];
      } catch (error) {
        handleSupabaseError(error, 'fetchAllProjects');
        return [];
      }
    };

    export const createProject = async (projectData) => {
      try {
        console.log('createProject: Received projectData:', projectData);
        
        // Convert camelCase to snake_case for database
        // Extract fields that need transformation or should be excluded
        const { 
          locationName, 
          manager_id, 
          id,           // Exclude id for new projects
          manager,      // Exclude manager (computed field)
          ...rest 
        } = projectData;
        
        // Build database object with only valid columns
        const dbProjectData = {
          name: rest.name,
          description: rest.description || null,
          location_name: locationName || rest.location_name || null,
          latitude: rest.latitude,
          longitude: rest.longitude,
          radius: rest.radius || 100,
          status: rest.status || 'Planning',
          budget: rest.budget || null,
          spent_budget: rest.spent_budget || 0,
          // Convert empty string to null for manager_id (UUID can be null but not empty string)
          manager_id: manager_id && manager_id.trim() !== '' ? manager_id : null
        };
        
        console.log('createProject: Transformed dbProjectData:', dbProjectData);
        
        const { data, error } = await supabase
          .from('projects')
          .insert([dbProjectData])
          .select()
          .single();
        
        if (error) {
          console.error('createProject: Supabase error:', error);
          throw error;
        }
        
        console.log('createProject: Success! Created project:', data);
        return data;
      } catch (error) {
        console.error('createProject: Caught error:', error);
        handleSupabaseError(error, 'createProject');
        throw error;
      }
    };

    export const fetchAllTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            profiles:assigned_to_user_id (
              name
            ),
            projects (
              name,
              location_name
            )
          `);
        if (error) throw error;
        const tasksWithDetails = data.map(task => ({
          ...task,
          assignedUserName: task.profiles ? task.profiles.name : 'Unassigned',
          projectName: task.projects ? task.projects.name : 'Unknown Project',
          projectLocation: task.projects ? task.projects.location_name : 'Unknown Location'
        }));
        return tasksWithDetails || [];
      } catch (error) {
        handleSupabaseError(error, 'fetchAllTasks');
        return [];
      }
    };

    export const createTask = async (taskData) => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([taskData])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, 'createTask');
        throw error;
      }
    };
    
    export const fetchAllProjectAssignments = async () => {
      try {
        const { data, error } = await supabase
          .from('project_assignments')
          .select('*, profiles:user_id (name), projects (name)');
        if (error) throw error;
        return data || [];
      } catch (error) {
        handleSupabaseError(error, 'fetchAllProjectAssignments');
        return [];
      }
    };

    export const assignWorker = async (userId, projectId) => {
      try {
        const { data: existing, error: checkError } = await supabase
          .from('project_assignments')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') throw checkError;

        if (existing) {
          const { error: updateError } = await supabase
            .from('project_assignments')
            .update({ project_id: projectId })
            .eq('user_id', userId);
          if (updateError) throw updateError;
          console.log(`Updated assignment for user ${userId} to project ${projectId}`);
        } else {
          const { error: insertError } = await supabase
            .from('project_assignments')
            .insert([{ user_id: userId, project_id: projectId }]);
          if (insertError) throw insertError;
          console.log(`Created new assignment for user ${userId} to project ${projectId}`);
        }

        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ assigned_project_id: projectId })
          .eq('id', userId);

        if (profileUpdateError) throw profileUpdateError;
        console.log(`Updated profile for user ${userId} with assignedProjectId ${projectId}`);

        return true;
      } catch (error) {
        handleSupabaseError(error, 'assignWorker');
        throw error;
      }
    };

    export const deleteProjectService = async (projectId) => {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);
        if (error) throw error;
        return true;
      } catch (error) {
        handleSupabaseError(error, 'deleteProjectService');
        throw error;
      }
    };

    export const updateProjectService = async (updatedProject) => {
      try {
        const { id, manager_id, locationName, ...updateData } = updatedProject;
        
        // Convert camelCase to snake_case for database
        const dbUpdateData = {
          ...updateData,
          location_name: locationName || updateData.location_name,
          // Convert empty string to null for manager_id (UUID can be null but not empty string)
          manager_id: manager_id && manager_id.trim() !== '' ? manager_id : null
        };
        
        // Update the project
        const { data: updatedProjectData, error: updateError } = await supabase
          .from('projects')
          .update(dbUpdateData)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Fetch the manager's name only if manager_id is not null
        let managerName = 'Unassigned';
        if (dbUpdateData.manager_id) {
          const { data: managerData, error: managerError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', dbUpdateData.manager_id)
            .single();

          if (!managerError && managerData) {
            managerName = managerData.name;
          }
        }

        // Return the combined data
        return {
          ...updatedProjectData,
          manager: managerName
        };
      } catch (error) {
        handleSupabaseError(error, 'updateProjectService');
        throw error;
      }
    };

    export const fetchTaskComments = async (taskId) => {
      try {
        const { data, error } = await supabase
          .from('task_comments')
          .select(`
            *,
            profiles:user_id (
              name
            )
          `)
          .eq('task_id', taskId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const commentsWithAuthor = data.map(comment => ({
          ...comment,
          authorName: comment.profiles ? comment.profiles.name : 'Unknown User'
        }));

        return commentsWithAuthor || [];
      } catch (error) {
        handleSupabaseError(error, 'fetchTaskComments');
        return [];
      }
    };

    export const createTaskComment = async (commentData) => {
      try {
        const { data, error } = await supabase
          .from('task_comments')
          .insert([commentData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, 'createTaskComment');
        throw error;
      }
    };

    export const fetchManagers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('role', 'project_manager');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        handleSupabaseError(error, 'fetchManagers');
        throw error;
      }
    };
