import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import StorageCanister "canister:storage";
import Types "../types";

module {
    type Result<T, E> = Types.Result<T, E>;

    public class StorageModule() {
        public func uploadToStorage(imageData: Blob, key: Text, contentType: Text) : async Text {
            try {
                let _ = await StorageCanister.store({
                    content = imageData;
                    content_encoding = "identity";
                    content_type = contentType;
                    key = key;
                    sha256 = null;
                });
                return key;
            } catch (e) {
                throw Error.reject("Storage canister error: " # Error.message(e));
            };
        };

        public func getImage(key: Text) : async ?Blob {
            try {
                let result = await StorageCanister.get({
                    key = key;
                    accept_encodings = ["identity"];
                });
                switch (result) {
                    case (content) {
                        if (content.content_encoding == "identity") {
                            ?content.content;
                        } else {
                            null;
                        };
                    };
                };
            } catch (e) {
                null;
            };
        };
    };
}; 