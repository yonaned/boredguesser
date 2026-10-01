import { redirect } from "next/dist/client/components/navigation";


export default function Home() {
  if (1+1===2) {
    redirect('/commingsoon'); 
  } else {
    redirect('/demolanding');
  }
}
