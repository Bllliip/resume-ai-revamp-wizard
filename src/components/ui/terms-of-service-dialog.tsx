import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const termsText = `Terms of Service
Effective Date: July 17, 2025

Please read these Terms of Service ("Terms", "Terms of Service") carefully before using this website ("the Service", "the Site").

By accessing or using this website, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Site.

1. Description of Service
This site provides tools and resources to assist users in creating resumes, cover letters, and other job-related materials. It is not an employment agency or job placement service.

2. No Guarantee of Employment
Use of this site does not guarantee job placement, interviews, or employment of any kind. While the goal is to help improve your job application materials, employment outcomes depend on many factors beyond the control of the site.

You acknowledge and agree that the site and its operators are not responsible or liable if you do not receive a job offer, interview, or employment opportunity.

3. User Responsibilities
You are solely responsible for the accuracy, truthfulness, and legality of any content you create or submit. You agree not to use this site for any unlawful, misleading, or fraudulent purposes.

4. Intellectual Property
All content, tools, branding, and features on this site are the intellectual property of their respective owners. You may not reproduce, distribute, or create derivative works without express written permission.

5. Accounts and Security
If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. The site is not liable for any losses or damages arising from unauthorized use.

6. Limitation of Liability
To the fullest extent allowed by applicable law, the site and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages—including but not limited to lost opportunities, data loss, or lost income—resulting from your use of or inability to use the site.

7. Privacy Policy
Use of the site is also governed by the Privacy Policy, which outlines how personal data is collected, used, and protected. By using the site, you consent to the data practices described therein.

8. Third-Party Links
The site may contain links to third-party websites or services. These are provided for convenience only. The site does not control or endorse any third-party content and is not responsible for anything that occurs on external sites.

9. Termination
Access to the site may be suspended or terminated at any time, without notice, for conduct that violates these Terms or is deemed harmful or unlawful.

10. Changes to Terms
These Terms may be updated at any time. Changes will be posted on this page. Continued use of the site after changes are made constitutes acceptance of the revised Terms.`

export function TermsOfServiceDialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-primary hover:underline">Terms of Service</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">{termsText}</pre>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}