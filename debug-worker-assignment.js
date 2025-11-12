// Script de diagnóstico para verificar la asignación de trabajadores
// Ejecuta esto en la consola del navegador cuando estés en la página de tareas

async function debugWorkerAssignment(projectId) {
  console.log('=== DEBUG: Worker Assignment ===');
  console.log('Project ID:', projectId);
  
  // 1. Verificar project_assignments
  const { data: assignments, error: assignmentError } = await supabase
    .from('project_assignments')
    .select('*')
    .eq('project_id', projectId);
  
  console.log('Project Assignments:', assignments);
  if (assignmentError) console.error('Assignment Error:', assignmentError);
  
  if (!assignments || assignments.length === 0) {
    console.warn('⚠️ No hay trabajadores asignados a este proyecto');
    return;
  }
  
  // 2. Verificar profiles
  const userIds = assignments.map(a => a.user_id);
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);
  
  console.log('All Profiles:', profiles);
  if (profileError) console.error('Profile Error:', profileError);
  
  // 3. Filtrar solo workers
  const workers = profiles?.filter(p => p.role === 'worker') || [];
  console.log('Workers (role=worker):', workers);
  
  if (workers.length === 0) {
    console.warn('⚠️ No hay usuarios con rol "worker" asignados a este proyecto');
    console.log('Roles encontrados:', profiles?.map(p => p.role));
  }
  
  return workers;
}

// Uso: debugWorkerAssignment('tu-project-id-aqui')
console.log('✅ Script cargado. Usa: debugWorkerAssignment("project-id")');
