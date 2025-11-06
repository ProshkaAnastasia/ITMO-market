import React, { useState, useEffect } from 'react';
import Icon from './Icon'; // ваш компонент Icon
import styles from '../styles/EditableField.module.css';

interface EditableFieldProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const save = () => {
        onChange(tempValue.trim());
        setEditing(false);
    };

    const cancel = () => {
        setTempValue(value);
        setEditing(false);
    };

    return (
        <div className={styles.editableField}>
            <label className={styles.fieldLabel}>{label}:</label>
            {editing ? (
                <>
                    <input
                        className={styles.inputText}
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        autoFocus
                    />
                    <button className={styles.saveButton} onClick={save}>
                        Сохранить
                    </button>
                    <button className={styles.cancelButton} onClick={cancel}>
                        Отмена
                    </button>
                </>
            ) : (
                <>
                    <span className={styles.fieldValue}>{value}</span>
                    <span
                        className={styles.editIconWrapper}
                        tabIndex={0}
                        role="button"
                        onClick={() => setEditing(true)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') setEditing(true);
                        }}
                    >
            <Icon name="Pencil" size={20} color="currentColor" />
          </span>
                </>
            )}
        </div>
    );
};

export default EditableField;
