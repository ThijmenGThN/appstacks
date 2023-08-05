import { useTranslations } from "next-intl"
import { Session, getServerSession } from "next-auth"

import options from "@/auth/options"

export default async function Logic() {
    return <Page session={await getServerSession(options)} />
}

function Page({ session }: { session: Session | null }) {
    const intl = useTranslations()

    return (
        <div className="overflow-hidden rounded-md bg-white shadow">
            <ul role="list" className="divide-y divide-gray-200">
                <li className="px-6 py-4">
                    <p className="font-semibold">Session data obtained within a server component</p>
                    <p className="m-2">Hi {session?.user.name}</p>
                </li>
            </ul>
        </div>
    )
}
