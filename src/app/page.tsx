import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { CheckCircle, UploadCloud, Users, LogIn, Ticket } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: 'Seamless Result Upload',
    description: 'Teachers can easily upload student results with our intuitive interface, with offline support.',
  },
  {
    icon: <Ticket className="h-8 w-8 text-primary" />,
    title: 'Scratch Card System',
    description: 'Admins can generate secure one-time scratch cards for students to verify their results.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Role-Based Dashboards',
    description: 'Dedicated dashboards for Students, Teachers, and Admins for a tailored experience.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Instant Verification',
    description: 'Students can check their results instantly using their unique scratch card PIN.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-students-2');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold sm:inline-block">EduResult Pro</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div className="absolute inset-0 bg-hero-pattern"></div>
           <div className="container relative grid items-center gap-12 px-4 text-center md:px-6 lg:grid-cols-2 lg:text-left">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                Academic Excellence,
                <span className="text-primary"> Simplified.</span>
              </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:mx-0 lg:text-base/relaxed xl:text-xl/relaxed">
                EduResult Pro is the all-in-one solution for managing and verifying student academic results with unparalleled efficiency and security.
              </p>
               <Card className="mx-auto max-w-md lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                      <CardTitle className="flex items-center justify-center lg:justify-start gap-2 font-headline text-2xl">
                          <LogIn className="h-6 w-6" />
                          <span>Login to Your Account</span>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap justify-center lg:justify-start gap-2">
                      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Link href="/login?role=student">Student Portal</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                          <Link href="/login?role=teacher">Teacher Portal</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                          <Link href="/login?role=admin">Admin Portal</Link>
                      </Button>
                  </CardContent>
               </Card>
            </div>
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {heroImage && (
                    <Image
                      src={heroImage.imageUrl}
                      alt={heroImage.description}
                      width={600}
                      height={400}
                      priority
                      className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                      data-ai-hint={heroImage.imageHint}
                    />
                )}
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is designed to provide a seamless and secure experience for everyone in the academic ecosystem.
              </p>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2">
              {features.map((feature, index) => (
                <Card key={index} className="mt-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} EduResult Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
