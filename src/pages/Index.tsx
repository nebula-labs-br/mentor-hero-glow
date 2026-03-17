import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/workshop.html");
  }, []);

  return null;
};

export default Index;
