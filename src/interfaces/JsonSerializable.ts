 interface JsonSerializable<T>{
    updateFromJson: (json: T) => void;
    toJSON:() => T;
}

export default JsonSerializable;