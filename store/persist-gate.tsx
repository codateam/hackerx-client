"use client";

import { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export const ReduxPersistGate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PersistGate persistor={persistor} loading={null}>
      {children}
    </PersistGate>
  );
};
