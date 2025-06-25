import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://zpxwdhsjupkmxzedphjf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpweHdkaHNqdXBrbXh6ZWRwaGpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTcxNTAsImV4cCI6MjA2NjQzMzE1MH0.ujaa3XtW2pI1ApOrVe-gv-OfGKqGqtGKGhbemgNKe6k';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database helper functions with correct table names
export const dbHelpers = {
  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users_sysadmin_2024')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateUser(id, updates) {
    try {
      // First update the user
      const { error: updateError } = await supabase
        .from('users_sysadmin_2024')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Then fetch the updated data
      const { data, error: fetchError } = await supabase
        .from('users_sysadmin_2024')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Tasks
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks_sysadmin_2024')
      .select(`
        *,
        assigned_user:assigned_to(id, full_name, email),
        created_by_user:created_by(id, full_name, email)
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createTask(task) {
    const { data, error } = await supabase
      .from('tasks_sysadmin_2024')
      .insert([task])
      .select()
      .single();
    return { data, error };
  },

  async updateTask(id, updates) {
    try {
      const { error: updateError } = await supabase
        .from('tasks_sysadmin_2024')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      const { data, error: fetchError } = await supabase
        .from('tasks_sysadmin_2024')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks_sysadmin_2024')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Backups
  async getBackups() {
    const { data, error } = await supabase
      .from('backups_sysadmin_2024')
      .select('*')
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  async createBackup(backup) {
    const { data, error } = await supabase
      .from('backups_sysadmin_2024')
      .insert([backup])
      .select()
      .single();
    return { data, error };
  },

  // Vulnerabilities
  async getVulnerabilities() {
    const { data, error } = await supabase
      .from('vulnerabilities_sysadmin_2024')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createVulnerability(vulnerability) {
    const { data, error } = await supabase
      .from('vulnerabilities_sysadmin_2024')
      .insert([vulnerability])
      .select()
      .single();
    return { data, error };
  },

  async updateVulnerability(id, updates) {
    try {
      const { error: updateError } = await supabase
        .from('vulnerabilities_sysadmin_2024')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      const { data, error: fetchError } = await supabase
        .from('vulnerabilities_sysadmin_2024')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // File uploads
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  async getFileUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },
};