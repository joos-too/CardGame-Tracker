import React, {createContext, useCallback, useContext, useMemo, useState} from "react";
import {Portal, Dialog, Button, Text} from "react-native-paper";

export type DialogAction = {
  label: string;
  onPress?: () => void;
  mode?: "text" | "contained" | "outlined";
};

type DialogConfig = {
  title: string;
  message?: string;
  actions?: DialogAction[];
};

type DialogContextValue = {
  show: (config: DialogConfig) => void;
  alert: (title: string, message?: string) => void;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [actions, setActions] = useState<DialogAction[] | undefined>(undefined);

  const hide = useCallback(() => setVisible(false), []);

  const show = useCallback((config: DialogConfig) => {
    setTitle(config.title);
    setMessage(config.message);
    setActions(config.actions && config.actions.length > 0 ? config.actions : [{ label: "OK" }]);
    setVisible(true);
  }, []);

  const alert = useCallback((t: string, m?: string) => {
    show({ title: t, message: m, actions: [{ label: "OK" }] });
  }, [show]);

  const ctx = useMemo<DialogContextValue>(() => ({ show, alert }), [show, alert]);

  return (
    <DialogContext.Provider value={ctx}>
      {children}
      <Portal>
        <Dialog visible={visible} onDismiss={hide}>
          {title ? <Dialog.Title>{title}</Dialog.Title> : null}
          {message ? (
            <Dialog.Content>
              <Text>{message}</Text>
            </Dialog.Content>
          ) : null}
          <Dialog.Actions>
            {(actions ?? [{ label: "OK" }]).map((a, idx) => (
              <Button
                key={`${a.label}-${idx}`}
                onPress={() => {
                  hide();
                  try { a.onPress && a.onPress(); } catch (e) { /* no-op */ }
                }}
                mode={a.mode}
              >
                {a.label}
              </Button>
            ))}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextValue => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within a DialogProvider");
  return ctx;
};
