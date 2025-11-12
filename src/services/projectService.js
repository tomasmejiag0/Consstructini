
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
      
      const { data, error } = await supabase.from('projects').insert([dbProjectData]).select();
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      return data;
    };
  