import React, { useEffect, useState } from "react";
import InlineInputBase from "../inline-input/inline-input-base";
import { observer } from "mobx-react";

interface InlineRenderTextNumberFieldProps {
  input: string;
  onBlur: (value: string) => void;
}

function InlineTextField({
  input,
  onBlur,
}: InlineRenderTextNumberFieldProps): JSX.Element {
  const [value, setValue] = useState<string>(input ?? "Welcome to PSI App");
  useEffect(() => setValue(input), [input]);

  return (
    <InlineInputBase
      value={value}
      isRequired={true}
      isEditDisabled={false}
      disallowExitEditModeWhileInvalid={true}
    >
      {(props) => (
        <input
          {...props}
          type="text"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          onFocus={(e) => {
            e.currentTarget.select();
            props.onFocus();
          }}
          onBlur={(e) => {
            onBlur(value);
            props.onBlur();
          }}
        />
      )}
    </InlineInputBase>
  );
}

export default observer(InlineTextField);
