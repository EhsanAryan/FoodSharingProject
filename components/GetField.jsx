"use client";

import React from 'react';
import SwitchCheckbox from './Form/SwitchCheckbox.jsx';
import InputField from './Form/InputField.jsx';
import SubmitButton from './Form/SubmitButton.jsx';
import PasswordInput from './Form/PasswordInput.jsx';
import SelectBox from './Form/SelectBox.jsx';
import SelectBoxTwo from './Form/SelectBoxTwo.jsx';
import DatePicker from './Form/DatePicker.jsx';
import MultiSelect from './Form/MultiSelect.jsx';
import SearchableSelect from './Form/SearchableSelect.jsx';
import Textarea from './Form/Textarea.jsx';

const GetField = (props) => {
    switch (props.control) {
        case "input":
            return <InputField {...props} />

        case "password":
            return <PasswordInput {...props} />

        case "textarea":
            return <Textarea {...props} />

        case "switch":
            return <SwitchCheckbox {...props} />

        case "select":
            return <SelectBox {...props} />

        case "select-two":
            return <SelectBoxTwo {...props} />

        case "multiselect":
            return <MultiSelect {...props} />

        case "searchableselect":
            return <SearchableSelect {...props} />

        case "datepicker":
            return <DatePicker {...props} />

        case "submit":
            return <SubmitButton {...props} />
            
        default:
            return <InputField {...props} />
    }
}

export default GetField;
