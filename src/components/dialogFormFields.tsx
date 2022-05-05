import { Button, Divider } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../store/storeProvider";
import dialogStyles from "../styles/dialog.css";

export const DialogFormFields = observer(
  (props: {
    wider: boolean;
    basicFields: JSX.Element[];
    advancedFields: JSX.Element[];
    showAdvanced: boolean;
    toggleAdvanced: () => void;
    validateForm: () => void;
  }) => {
    const {
      wider,
      basicFields,
      advancedFields,
      showAdvanced,
      toggleAdvanced,
      validateForm,
    } = props;
    const { options } = useStore();

    return (
      <div className={dialogStyles.DialogRow}>
        <div
          className={
            wider
              ? dialogStyles.DialogColumnWider
              : dialogStyles.DialogColumnWide
          }
        >
          <div className={dialogStyles.DialogRow}>
            <div className={dialogStyles.DialogColumn}>
              {basicFields.map((field, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  {field}
                </div>
              ))}
            </div>
          </div>
          {options.allowAdvancedFields && advancedFields.length > 0 && (
            <>
              {showAdvanced && (
                <>
                  <Divider />
                  <div className={dialogStyles.DetailsSectionHeader}>
                    Advanced options
                  </div>
                  {advancedFields.map((field, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      {field}
                    </div>
                  ))}
                </>
              )}
              <Divider />
              <Button
                size="small"
                onClick={async () => {
                  toggleAdvanced();
                  await validateForm();
                }}
              >
                {showAdvanced
                  ? "Hide advanced options"
                  : "Show advanced options"}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
);
