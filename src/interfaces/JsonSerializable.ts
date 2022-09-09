 interface JsonSerializable<T>{
    updateFromJson: (json: T) => void;
}

export default JsonSerializable;