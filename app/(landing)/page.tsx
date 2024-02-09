
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CardDetails } from "./_components/CardDetails";
import { CardDetailsTwo } from "./_components/CardDetailsTwo";
import DataTableCard from "./_components/DataTableCard";
// import Heading from "./_components/Heading";
// import LogoImage from "./_components/LogoImage";
// import Footer from "./_components/Footer";


function DemoContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {

  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full border border-red-950 lg:px-60 md:px-24 py-8",
        className
      )}
      {...props}
    />
  )
}


export default function LandingPage() {
  
   
  return (
    <DemoContainer>
      <DataTableCard />
    </DemoContainer>
  );
}
