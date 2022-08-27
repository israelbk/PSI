import React, { useEffect, useMemo, useState } from 'react';
import { Tooltip } from '../tooltip/tooltip';
import './inline-input-base.scss';
import {getClasses} from "../../utils/utils";

export interface InlineInputProvidedProps {
  'data-testid': string;
  className: string;
  onFocus: () => void;
  onBlur: () => void;
}

export interface InlineInputBaseProps {
  error?: string;
  value: string;
  isRequired?: boolean;
  testId?: string;
  className?: string;
  disallowExitEditModeWhileInvalid?: boolean;
  isEditDisabled: boolean;
  children: (props: InlineInputProvidedProps) => JSX.Element;
}

export default function InlineInputBase(props: InlineInputBaseProps) {
  const {
    error,
    value,
    isRequired = false,
    testId = '',
    className,
    children,
    disallowExitEditModeWhileInvalid = false,
    isEditDisabled = false,
  } = props;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [initialEditedValue, setInitialEditedValue] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>();

  useEffect(() => {
    if (isInEditMode && !isDirty && value != initialEditedValue) {
      setIsDirty(true);
    }
  }, [isInEditMode, isDirty, value, initialEditedValue]);

  const isEmpty = value.trim() === '';

  const errorMsg = useMemo(() => {
    if (!isDirty || !isInEditMode) return undefined;
    if (error != undefined) return error;
    if (isEmpty && isRequired) {
      return "Required";
    }
    return undefined;
  }, [value, isEmpty, isDirty, isInEditMode, error, isRequired]);

  useEffect(() => {
    if (!isInEditMode) {
      setInitialEditedValue(null);
      setIsDirty(false);
    } else {
      if (initialEditedValue == null) {
        setInitialEditedValue(value);
      }
    }
  }, [isInEditMode, value, initialEditedValue]);

  function renderDisplayMode() {
    const hasNoValue = value.trim().toString().length === 0;
    return (
        <Tooltip
            content="Can't be edited"
            disabled={!isEditDisabled}
        >
          <div
              data-testid={`automation-inline-input-base-display-${testId}`}
              className={getClasses([
                'inline-input-base-display-mode-container',
                hasNoValue && 'render-border',
                className,
              ])}
              onClick={() => setIsInEditMode(!isEditDisabled)}
          >
           {value}
          </div>
        </Tooltip>
    );
  }

  function renderEditMode() {
    return children({
      'data-testid': `automation-inline-input-base-edit-${testId}`,
      className: getClasses('inline-input-base-edit-mode-container', errorMsg != null && 'invalid'),
      onFocus: () => setIsInEditMode(true),
      onBlur: () => setIsInEditMode(disallowExitEditModeWhileInvalid && errorMsg != null),
    });
  }

  return (
      <Tooltip content={errorMsg} wrapperClass="inline-input-base" disabled={!isInEditMode || errorMsg == null}>
        <div className="inline-input-base-content">
          {isInEditMode && !isEditDisabled ? renderEditMode() : renderDisplayMode()}
        </div>
      </Tooltip>
  );
}
