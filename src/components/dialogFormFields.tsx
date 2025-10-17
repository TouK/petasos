import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../store/storeProvider";

function ToggleButton({
    toggleAdvanced,
    validateForm,
    showAdvanced,
}: {
    toggleAdvanced: () => void;
    validateForm: () => void;
    showAdvanced: boolean;
}) {
    return (
        <Button
            size="small"
            onClick={async () => {
                toggleAdvanced();
                await validateForm();
            }}
        >
            {showAdvanced ? "Hide advanced options" : "Show advanced options"}
        </Button>
    );
}

export const DialogFormFields = observer(
    (props: {
        basicFields: JSX.Element[];
        advancedFields: JSX.Element[];
        schemaInputField: JSX.Element;
        showSchemaInput: boolean;
        showAdvanced: boolean;
        toggleAdvanced: () => void;
        validateForm: () => void;
    }) => {
        const { basicFields, schemaInputField, showSchemaInput, advancedFields, showAdvanced, toggleAdvanced, validateForm } = props;
        const { options } = useStore();

        const toggleButton = <ToggleButton toggleAdvanced={toggleAdvanced} validateForm={validateForm} showAdvanced={showAdvanced} />;
        return (
            <>
                {basicFields.map((field, i) => (
                    <Box key={i}>{field}</Box>
                ))}
                {showSchemaInput && <Box key={1}>{schemaInputField}</Box>}
                {options.allowAdvancedFields && advancedFields.length > 0 && (
                    <>
                        <Divider>{toggleButton}</Divider>
                        {showAdvanced && advancedFields.map((field, i) => <Box key={i}>{field}</Box>)}
                    </>
                )}
            </>
        );
    },
);
