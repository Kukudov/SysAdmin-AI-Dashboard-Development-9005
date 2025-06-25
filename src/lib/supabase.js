import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const dbHelpers = {
  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Tasks
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
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
      .from('tasks')
      .insert([task])
      .select()
      .single();
    return { data, error };
  },

  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Backups
  async getBackups() {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('timestamp', { ascending: false });
    return { data, error };
  },

  async createBackup(backup) {
    const { data, error } = await supabase
      .from('backups')
      .insert([backup])
      .select()
      .single();
    return { data, error };
  },

  // Vulnerabilities
  async getVulnerabilities() {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createVulnerability(vulnerability) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .insert([vulnerability])
      .select()
      .single();
    return { data, error };
  },

  async updateVulnerability(id, updates) {
    const { data, error } = await supabase
      .from('vulnerabilities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
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