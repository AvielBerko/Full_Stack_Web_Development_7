import React from "react";
import { createPortal } from "react-dom";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { ThemeProvider, createTheme } from "@mui/material";

const ContextMenu = ({
  contextMenuRef,
  contextMenuPosition,
  onClose,
  options,
}) => {
  return (
    <div
      ref={contextMenuRef}
      style={{
        position: "fixed",
        top: contextMenuPosition.y,
        left: contextMenuPosition.x,
        backgroundColor: "white",
        boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)",
        padding: "4px",
        borderRadius: "4px",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
        <Paper sx={{ width: 100, maxWidth: "100%" }}>
          <MenuList>
            {options.map((option) => (
              <MenuItem
                key={Object.keys(option)[0]}
                onClick={Object.values(option)[0]}
              >
                <ListItemText>{Object.keys(option)[0]}</ListItemText>
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </ThemeProvider>
    </div>
  );
};

export default ContextMenu;
