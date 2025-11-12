
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
      const { locationName, ...rest } = projectData;
      const dbProjectData = {
        ...rest,
        location_name: locationName || rest.location_name,
        radius: projectData.radius || 100
      };
      
      const { data, error } = await supabase.from('projects').insert([dbProjectData]).select();
      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      return data;
    };
  