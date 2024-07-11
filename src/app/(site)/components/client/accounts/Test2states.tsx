"use client";
import { Box, Button, Center, Link, Text } from "@chakra-ui/react"
import { useEffect, useReducer, useRef, useState } from "react";

const reducerCounter0 = (state: number, action: string) => {
  switch (action) {
    case "Increment":
      return state + 1;
    case "Reset":
      return 2;
    default:
      return state;
  }
}

export default function Test2States() {
  const [counter0, dispatchCounter0] = useReducer(reducerCounter0, 0);
  const [timerId, setTimerId] = useState<NodeJS.Timer | undefined>(undefined);

  useEffect(() => {
    const tim = setInterval(() => {
      dispatchCounter0("Increment");
    }
      , 4000 //ms
    );
    setTimerId(() => tim);
    console.log("startTimer", tim);

    return () => {
      clearInterval(tim);
      console.log("stopTimer", tim);
    }
  }
    , []);

  function set2() {
    dispatchCounter0("Reset");
  }

  return (
    <Box bg={"lightyellow"}>
      <Center>
        <Button
          onClick={() => { dispatchCounter0("Reset"); }}
          m={2}
        > switch  </Button>
        {counter0}
      </Center>
    </Box>
  )
}