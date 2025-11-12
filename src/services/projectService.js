
    import { supabase } from '@/lib/supabaseClient';

    export const fetchAllProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data || [];
    };

    export const createProject = async (projectData) => {
      // Convert camelCase to snake_case for database
      const { locationName, manager_id, ...rest } = projectData;
      const dbProjectData = {
        ...rest,
        location_name: locationName || rest.location_name,
        radius: projectData.radius || 100,
        // Convert empty string to null for manager_id (UUID can be null but not empty string)
        manager_id: manager_id && manager_id.trim() !== '' ? manager_id : null
      };
      
      const { data, error } = await supabase.from('projects').insert([dbProjectData]).select();
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      return data;
    };
  