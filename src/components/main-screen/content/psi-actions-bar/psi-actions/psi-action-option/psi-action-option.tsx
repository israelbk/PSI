import "./psi-action-option.scss";

interface PsiActionOptionProps {
  text: string;
  onClick: () => void;
  renderIcon: () => JSX.Element;
  disabled?: boolean;
}
function PsiActionOption(props: PsiActionOptionProps) {
  const { text, onClick, disabled, renderIcon } = props;
  return disabled ? null : (
    <div className="psi-single-action-wrapper" onClick={() => {onClick();}}>
      <>
        {renderIcon()}
        <div className="psi-action-title">{text}</div>
      </>
    </div>
  );
}

export default PsiActionOption;
