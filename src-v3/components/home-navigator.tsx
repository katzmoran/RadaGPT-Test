import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AI_NAME } from "@/lib/config";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeNavigator() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={`/`}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Image
              src={"/ai-icon.png"}
              width={32}
              height={32}
              alt={AI_NAME}
              className="flex"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="font-semibold">{AI_NAME}</span>
              <span className="">Home</span>
            </div>
            <Edit className="size-4" />
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
