mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use crate::commands::{play_sound, debug_msg};

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![play_sound, debug_msg])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
