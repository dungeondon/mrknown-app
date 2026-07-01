# Logo Setup

To add your Mr Known logo:
1. Place your logo file here as `logo.png` (or `logo.svg`)
2. Open `components/Navbar.tsx`
3. Find the comment "LOGO IMAGE: Replace below span with:"
4. Replace the <span> logo placeholder with:
   <Image src="/logo.png" alt="mrknown" width={110} height={32} className="h-8 w-auto" />
