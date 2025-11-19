use rodio::{OutputStreamBuilder, Sink};
use std::env;
use std::path::PathBuf;

#[tauri::command]
fn debug_msg(message: &str) {
    println!("debug: {}", message)
}

fn get_asset_path(sound_type: &str) -> Option<PathBuf> {
    let filename = match sound_type {
        "working" => "working.wav",
        "break" => "break.wav",
        "done" => "done.wav",
        _ => return None,
    };

    if let Ok(exe_path) = env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let dev_path = exe_dir
                .parent()
                .and_then(|p| p.parent())
                .map(|p| p.join("src-tauri").join("assets").join(filename));
            
            if let Some(ref dev_path) = dev_path {
                if dev_path.exists() {
                    return Some(dev_path.clone());
                }
            }

            // 本番環境: 実行ファイルと同じディレクトリにassetsフォルダがある場合
            let prod_path = exe_dir.join("assets").join(filename);
            if prod_path.exists() {
                return Some(prod_path);
            }

            // 本番環境: 実行ファイルの親ディレクトリにassetsフォルダがある場合
            if let Some(parent) = exe_dir.parent() {
                let prod_path2 = parent.join("assets").join(filename);
                if prod_path2.exists() {
                    return Some(prod_path2);
                }
            }
        }
    }

    None
}

#[tauri::command]
fn play_sound(sound_type: &str) {
    if let Some(path) = get_asset_path(sound_type) {
        if let Ok(stream_handle) = OutputStreamBuilder::open_default_stream() {
            let sink = Sink::connect_new(stream_handle.mixer());

            if let Ok(f) = std::fs::File::open(&path) {
                if let Ok(decoder) = rodio::Decoder::try_from(f) {
                    sink.append(decoder);
                    sink.sleep_until_end();
                }
            }
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![debug_msg, play_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
