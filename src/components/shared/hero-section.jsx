import { Button } from "@/components/ui/button";
import { AddCourseModal } from "@/components/shared/add-course-modal";
import Link from "next/link";

export default function HeroSection() {
    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-34 text-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">
                    Find Your Perfect Course<br/>Backed by <span className="text-primary">Verified Student</span> Reviews
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Make informed decisions about your education with real reviews from
                    students. Discover the best courses across various categories.
                </p>
                <div className="flex items-center justify-center mb-8">
                    <div className="flex -space-x-4">
                        <img
                            className="w-10 h-10 rounded-full border-2 border-white"
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="Profile 1"
                        />
                        <img
                            className="w-10 h-10 rounded-full border-2 border-white"
                            src="https://randomuser.me/api/portraits/men/44.jpg"
                            alt="Profile 2"
                        />
                        <img
                            className="w-10 h-10 rounded-full border-2 border-white"
                            src="https://randomuser.me/api/portraits/men/65.jpg"
                            alt="Profile 3"
                        />
                        <img
                            className="w-10 h-10 rounded-full border-2 border-white"
                            src="https://randomuser.me/api/portraits/men/68.jpg"
                            alt="Profile 4"
                        />
                    </div>
                    <span className="ml-3 text-sm font-medium text-left text-muted-foreground">
                        Trusted by<br/><span className="text-primary font-bold">5000+</span> students
                    </span>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button size="lg" asChild>
                        <Link href="/categories">Explore Courses</Link>
                    </Button>
                    <AddCourseModal
                        trigger={
                            <Button size="lg" variant="secondary">
                                Add Course
                            </Button>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
