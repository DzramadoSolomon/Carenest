import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://ilthrzxggpbrkuvrkxiq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdGhyenhnZ3Bicmt1dnJreGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzcwMjEsImV4cCI6MjA2NTk1MzAyMX0.sfXMDQZrgBVB4DHvQyq-443LaOzSX43K0LyO_XcXiPI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };