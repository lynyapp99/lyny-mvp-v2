import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Invite() {
  const { token } = useParams();
  const [debug, setDebug] = useState("carregando...");

  useEffect(() => {
    const run = async () => {
      setDebug(`token: ${token}`);
      const { data, error } = await supabase.rpc("get_invite_info", { _token: token as string });
      setDebug(
        `token: ${token}\ndata: ${JSON.stringify(data)}\nerror: ${JSON.stringify(error)}`
      );
    };
    run();
  }, [token]);

  return (
    <pre style={{ padding: 24, color: "white", background: "black", whiteSpace: "pre-wrap", wordBreak: "break-all", minHeight: "100vh", fontSize: 14 }}>
      {debug}
    </pre>
  );
}
