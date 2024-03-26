import AddTodoHome from "@/components/AddTodoHome"
import HeroHome from "@/components/HeroHome"
import getCurrentUser from "@/libs/getCurrentUser"

export default async function Home() {
  const currentUser = await getCurrentUser()
  return (
    <div>
      {currentUser?.id && (<AddTodoHome />)}
      <HeroHome />
    </div>
  )
}
