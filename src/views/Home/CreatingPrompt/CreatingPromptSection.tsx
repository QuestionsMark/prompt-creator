import { ChangeEvent, MouseEvent, ReactNode } from "react";

interface Props {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    submitValue: ReactNode;
    submitDisabled?: boolean;
    submitBig?: boolean;
    reversed?: boolean;
}

export const CreatingPromptSection = ({ onChange, onSubmit, readOnly, reversed, submitValue, submitBig, value, placeholder, submitDisabled }: Props) => {
    return (
        <div className="creating-prompt__section">
            {reversed ? <>
                <button
                    onClick={onSubmit}
                    className={`creating-prompt__submit${submitBig ? ' creating-prompt__submit--big' : ''}`}
                    disabled={submitDisabled}
                >
                    {submitValue}
                </button>
                <textarea
                    value={value}
                    onChange={onChange}
                    minLength={1}
                    className="creating-prompt__textarea"
                    placeholder={placeholder}
                    readOnly={readOnly}
                />
            </> : <>
                <textarea
                    value={value}
                    onChange={onChange}
                    minLength={1}
                    className="creating-prompt__textarea"
                    placeholder={placeholder}
                    readOnly={readOnly}
                />
                <button
                    onClick={onSubmit}
                    className={`creating-prompt__submit${submitBig ? ' creating-prompt__submit--big' : ''}`}
                    disabled={submitDisabled}
                >
                    {submitValue}
                </button>
            </>}
        </div>
    );
};