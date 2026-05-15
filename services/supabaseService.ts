import { supabase } from '../lib/supabase';
import { VolleyAnalysis } from '../types';

export const supabaseService = {
  async saveAnalysis(userId: string, analysis: VolleyAnalysis) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('analyses')
      .insert([
        {
          user_id: userId,
          activity: analysis.activity,
          feedback: analysis.feedback,
          form_quality: analysis.formQuality,
          power_score: analysis.powerScore,
          joint_angles: analysis.jointAngles,
          jump_height: analysis.jumpHeight,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
    return data;
  },

  async getUserAnalyses(userId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    }
    return data;
  },

  async getProfile(userId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, profile: { full_name?: string; avatar_url?: string }) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    return data;
  }
};
