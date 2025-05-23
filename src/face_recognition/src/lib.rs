use candid::{CandidType, Deserialize};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager},
    DefaultMemoryImpl,
};
// use ic_cdk::export::Principal;
use std::cell::RefCell;
use onnx::{setup, BoundingBox, Embedding, Person};
// use ic_cdk::types::Principal;

// mod benchmarking;
mod onnx;
mod storage;

// WASI polyfill requires a virtual stable memory to store the file system.
// You can replace `0` with any index up to `254`.
const WASI_MEMORY_ID: MemoryId = MemoryId::new(0);

// Files in the WASI filesystem (in the stable memory) that store the models.
const FACE_DETECTION_FILE: &str = "face-detection.onnx";
const FACE_RECOGNITION_FILE: &str = "face-recognition.onnx";

thread_local! {
    // Users
    static USERS: RefCell<Vec<User>> = RefCell::new(Vec::new());
    // The memory manager is used for simulating multiple memories.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
}

/// An error that is returned to the front-end.
#[derive(CandidType, Deserialize)]
struct Error {
    message: String,
}

/// The result of the face detection endpoint.
#[derive(CandidType, Deserialize)]
enum Detection {
    Ok(BoundingBox),
    Err(Error),
}

/// The result of the face addition endpoint.
#[derive(CandidType, Deserialize)]
enum Addition {
    Ok(Embedding),
    Err(Error),
}

/// The result of the face recognition endpoint.
#[derive(CandidType, Deserialize)]
enum Recognition {
    Ok(Person),
    Err(Error),
}

#[derive(CandidType, Deserialize, Clone)]
enum Status {
    Unverify,
    Success,
    Failed,
}

#[derive(CandidType, Deserialize, Clone)]
struct User {
    id: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    status: Status, // Added status field
}


/// Returns a bounding box around the detected face in the input image.
#[ic_cdk::query]
fn detect(image: Vec<u8>) -> Detection {
    let result = match onnx::detect(image) {
        Ok(result) => Detection::Ok(result.0),
        Err(err) => Detection::Err(Error {
            message: err.to_string(),
        }),
    };
    result
}

/// Performs face recognition and returns the name of the person whose recorded
/// face is closest to the face in the given image. It also returns the distance
/// between the face embeddings.
#[ic_cdk::update]
fn recognize(image: Vec<u8>) -> Recognition {
    let result = match onnx::recognize(image) {
        Ok(result) => Recognition::Ok(result),
        Err(err) => Recognition::Err(Error {
            message: err.to_string(),
        }),
    };
    result
}

/// Adds a person with the given name (label) and face (image) for future
/// face recognition requests.
#[ic_cdk::update]
fn add(label: String, image: Vec<u8>) -> Addition {
    let result = match onnx::add(label, image) {
        Ok(result) => Addition::Ok(result),
        Err(err) => Addition::Err(Error {
            message: err.to_string(),
        }),
    };
    result
}

/// Clears the face detection model file.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn clear_face_detection_model_bytes() {
    storage::clear_bytes(FACE_DETECTION_FILE);
}

/// Clears the face recognition model file.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn clear_face_recognition_model_bytes() {
    storage::clear_bytes(FACE_RECOGNITION_FILE);
}

/// Appends the given chunk to the face detection model file.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn append_face_detection_model_bytes(bytes: Vec<u8>) {
    storage::append_bytes(FACE_DETECTION_FILE, bytes);
}

/// Appends the given chunk to the face recognition model file.
/// This is used for incremental chunk uploading of large files.
#[ic_cdk::update]
fn append_face_recognition_model_bytes(bytes: Vec<u8>) {
    storage::append_bytes(FACE_RECOGNITION_FILE, bytes);
}

/// Once the model files have been incrementally uploaded,
/// this function loads them into in-memory models.
#[ic_cdk::update]
fn setup_models() -> Result<(), String> {
    setup(
        storage::bytes(FACE_DETECTION_FILE),
        storage::bytes(FACE_RECOGNITION_FILE),
    )
    .map_err(|err| format!("Failed to setup model: {}", err))
}

#[ic_cdk::init]
fn init() {
    let wasi_memory = MEMORY_MANAGER.with(|m| m.borrow().get(WASI_MEMORY_ID));
    ic_wasi_polyfill::init_with_memory(&[0u8; 32], &[], wasi_memory);
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    let wasi_memory = MEMORY_MANAGER.with(|m| m.borrow().get(WASI_MEMORY_ID));
    ic_wasi_polyfill::init_with_memory(&[0u8; 32], &[], wasi_memory);
}


// user

// Create a new user
#[ic_cdk::update]
fn create_user(
    id: String,
    name: String,
    email: String,
    phone: String,
    address: String,
) -> Result<(), String> {
    // Clone `name` and `images` before they are moved
    // let name_clone = name.clone();
    // let images_clone = images.clone();

    // Add the user image to the model
    // add(name, images);

    // Recognize the person image
    // let recognition: Recognition = recognize(personimage.clone());

    // Determine the status based on recognition result
    // let status = if let Recognition::Ok(person) = recognition {
    //     if person.label() == name_clone {
    //         Status::Success
    //     } else {
    //         Status::Failed
    //     }
    // } else {
    //     Status::Failed
    // };

    let user_exists = USERS.with(|users| {
        users.borrow().iter().any(|user| user.id == id)
    });

    if user_exists {
        return Err("User with this ID already exists.".to_string());
    }

    // Create the user with the determined status
    let user = User {
        id,
        name,
        email,
        phone,
        address,
        status: Status::Unverify , // Set the status field
    };
    
    USERS.with(|users| users.borrow_mut().push(user));

    Ok(())
}


// Get a user by ID
#[ic_cdk::query]
fn get_user(id: String) -> Option<User> {
    USERS.with(|users| users.borrow().iter().find(|&user| user.id == id).cloned())
}

// Update a user's information
#[ic_cdk::update]
fn update_user(id: String, new_name: String) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.iter_mut().find(|user| user.id == id) {
            user.name = new_name;
            Ok(())
        } else {
            Err("User not found".to_string())
        }
    })
}

// Delete a user by ID
#[ic_cdk::update]
fn delete_user(id: String) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        let len_before = users.len();
        users.retain(|user| user.id != id);
        if users.len() < len_before {
            Ok(())
        } else {
            Err("User not found".to_string())
        }
    })
}