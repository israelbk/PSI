import React, { useEffect, useState } from "react";
import InlineInputBase from "../inline-input/inline-input-base";
import { observer } from "mobx-react";
import { Tooltip } from "../tooltip/tooltip";

interface InlineRenderTextNumberFieldProps {
  input: string;
  onBlur: (value: string) => void;
  className?: string;
  tooltipContent?: string;
}

function InlineTextField({
  input,
  onBlur,
  className = "",
  tooltipContent,
}: InlineRenderTextNumberFieldProps): JSX.Element {
  const [value, setValue] = useState<string>(input ?? "Welcome to PSI App");
  useEffect(() => setValue(input), [input]);

  return (
    <Tooltip
      content={tooltipContent}
      disabled={tooltipContent == null || input.trim() === ""}
    >
      <bdi dir="auto">
        <InlineInputBase
          value={value}
          isRequired={true}
          isEditDisabled={false}
          disallowExitEditModeWhileInvalid={true}
          className={className}
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
      </bdi>
    </Tooltip>
  );
}

export default observer(InlineTextField);
