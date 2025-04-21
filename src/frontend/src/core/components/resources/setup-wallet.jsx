

import { motion } from "framer-motion"
import { Wallet, Shield, ArrowRight, AlertTriangle, CheckCircle2, HelpCircle, MessageSquare, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/core/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { Button } from "@/core/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/core/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/alert"
import WalletAnimation from "@/core/components/resources/animations/wallet-animation"

export default function SetupWallet() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center mb-6">
          <Wallet className="h-8 w-8 mr-3 text-primary" />
          <h2 className="text-3xl font-bold">Set Up Your ICP Wallet</h2>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to create and manage your Internet Computer Protocol wallet to store your digital assets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>What is an ICP Wallet?</CardTitle>
            <CardDescription>Understanding the basics of Internet Computer Protocol wallets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              An ICP wallet is a digital tool that allows you to store, manage, and interact with tokens and assets on
              the Internet Computer blockchain. Think of it as a secure digital wallet for your crypto assets.
            </p>

            <h4 className="font-semibold text-lg mb-2">Key Features:</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Shield className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Secure Storage</span>
                  <p className="text-sm text-muted-foreground">
                    Safely store your digital assets with encryption and security features.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Send & Receive</span>
                  <p className="text-sm text-muted-foreground">
                    Transfer tokens to and from other users or applications.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">Interact with dApps</span>
                  <p className="text-sm text-muted-foreground">Connect to decentralized applications like Lumora.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        <div>
          <WalletAnimation />
        </div>
      </div>

      <Tabs defaultValue="internet-identity" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="internet-identity">Internet Identity</TabsTrigger>
          <TabsTrigger value="plug-wallet">Plug Wallet</TabsTrigger>
          <TabsTrigger value="stoic-wallet">Stoic Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="internet-identity">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Internet Identity</CardTitle>
              <CardDescription>The official authentication system for the Internet Computer</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-border">
                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    1
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Visit the Internet Identity Website</h4>
                  <p className="text-muted-foreground mb-2">
                    Go to{" "}
                    <a
                      href="https://identity.ic0.app"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://identity.ic0.app
                    </a>{" "}
                    in your web browser.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>Make sure you're on the official website to avoid phishing attempts.</p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    2
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Create a New Identity</h4>
                  <p className="text-muted-foreground mb-2">
                    Click on "Create New Identity" and follow the on-screen instructions.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>
                      You'll be asked to set up a device for authentication. This could be your computer, phone, or a
                      security key.
                    </p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    3
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Set Up Your Recovery Method</h4>
                  <p className="text-muted-foreground mb-2">Choose and configure your preferred recovery method.</p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>
                      Options typically include a seed phrase, another device, or a security key. We recommend using
                      multiple recovery methods for added security.
                    </p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    4
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Complete Identity Creation</h4>
                  <p className="text-muted-foreground mb-2">
                    Finish the setup process and note your Identity Anchor (a unique number).
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>
                      Your Identity Anchor is how you'll access your Internet Identity in the future. Store this number
                      securely.
                    </p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    5
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Connect to Lumora</h4>
                  <p className="text-muted-foreground mb-2">
                    Return to Lumora and click "Connect Wallet" then select "Internet Identity".
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>
                      You'll be prompted to authenticate with your Internet Identity and authorize the connection to
                      Lumora.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 text-center">
                <Button size="lg">
                  Set Up Internet Identity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plug-wallet">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Plug Wallet</CardTitle>
              <CardDescription>A browser extension wallet for the Internet Computer</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-border">
                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    1
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Install the Plug Extension</h4>
                  <p className="text-muted-foreground mb-2">
                    Visit the{" "}
                    <a
                      href="https://plugwallet.ooo/"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Plug Wallet website
                    </a>{" "}
                    and install the browser extension.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>Plug is available for Chrome, Firefox, and other Chromium-based browsers like Brave and Edge.</p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    2
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Create a New Wallet</h4>
                  <p className="text-muted-foreground mb-2">Open the Plug extension and click "Create New Wallet".</p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>
                      You'll need to set a password for your wallet. Choose a strong, unique password that you haven't
                      used elsewhere.
                    </p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    3
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Secure Your Recovery Phrase</h4>
                  <p className="text-muted-foreground mb-2">
                    Write down your 12-word recovery phrase and store it securely.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="font-medium text-amber-600">
                      CRITICAL: Never share this phrase with anyone or store it digitally. Write it down on paper and
                      keep it in a secure location.
                    </p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    4
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Verify Your Recovery Phrase</h4>
                  <p className="text-muted-foreground mb-2">
                    Confirm your recovery phrase by entering the words in the correct order.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>This step ensures you've correctly recorded your recovery phrase.</p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    5
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Connect to Lumora</h4>
                  <p className="text-muted-foreground mb-2">
                    Return to Lumora and click "Connect Wallet" then select "Plug".
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>You'll be prompted to authorize the connection between Plug and Lumora.</p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 text-center">
                <Button size="lg">
                  Set Up Plug Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stoic-wallet">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Stoic Wallet</CardTitle>
              <CardDescription>A web-based wallet for the Internet Computer</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-[1px] before:bg-border">
                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    1
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Visit the Stoic Wallet Website</h4>
                  <p className="text-muted-foreground mb-2">
                    Go to{" "}
                    <a
                      href="https://www.stoicwallet.com"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.stoicwallet.com
                    </a>{" "}
                    in your web browser.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>Ensure you're on the official website to avoid phishing attempts.</p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    2
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Create a New Wallet</h4>
                  <p className="text-muted-foreground mb-2">
                    Click "Create a New Wallet" and follow the on-screen instructions.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>You can create a wallet using Internet Identity or by generating a new seed phrase.</p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    3
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Secure Your Seed Phrase</h4>
                  <p className="text-muted-foreground mb-2">
                    If you choose the seed phrase option, write down your seed phrase and store it securely.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="font-medium text-amber-600">
                      CRITICAL: Never share this phrase with anyone or store it digitally. Write it down on paper and
                      keep it in a secure location.
                    </p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    4
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Set Up Your Wallet</h4>
                  <p className="text-muted-foreground mb-2">
                    Complete the setup process by following the remaining instructions.
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>You may be asked to create a password or PIN for additional security.</p>
                  </div>
                </li>

                <li className="pl-10 relative">
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    5
                  </div>
                  <h4 className="font-semibold text-lg mb-1">Connect to Lumora</h4>
                  <p className="text-muted-foreground mb-2">
                    Return to Lumora and click "Connect Wallet" then select "Stoic".
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p>You'll be redirected to Stoic to authorize the connection to Lumora.</p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 text-center">
                <Button size="lg">
                  Set Up Stoic Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Wallet Security Best Practices</CardTitle>
          <CardDescription>Essential tips to keep your digital assets safe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Do's</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Store your recovery phrase offline in a secure location</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use strong, unique passwords for your wallet</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enable two-factor authentication when available</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Keep your devices and software updated</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify website URLs before connecting your wallet</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Don'ts</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Never share your recovery phrase or private keys with anyone</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't store your recovery phrase digitally (e.g., in emails or cloud storage)</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Avoid connecting your wallet to untrusted websites or applications</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't use public Wi-Fi when accessing your wallet</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Don't click on suspicious links or respond to unsolicited messages about your wallet</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full mb-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">What is the difference between the wallet options?</h4>
                <p className="text-muted-foreground">
                  Internet Identity is the official authentication system for the Internet Computer, offering high
                  security. Plug is a browser extension wallet with a user-friendly interface. Stoic is a web-based
                  wallet that's accessible from any browser without installation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Do I need to pay to create a wallet?</h4>
                <p className="text-muted-foreground">
                  No, creating an ICP wallet is free. However, some operations on the Internet Computer may require a
                  small amount of cycles or ICP tokens to execute.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">What should I do if I lose my recovery phrase?</h4>
                <p className="text-muted-foreground">
                  If you lose your recovery phrase, you may lose access to your wallet and assets permanently. There is
                  typically no way to recover a lost phrase, which is why it's crucial to store it securely.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Can I use multiple wallets with Lumora?</h4>
                <p className="text-muted-foreground">
                  Yes, you can connect different wallets to your Lumora account. However, your rewards and assets will
                  be associated with the specific wallet you use for each action.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">How do I receive tokens in my wallet?</h4>
                <p className="text-muted-foreground">
                  To receive tokens, you'll need to share your wallet address with the sender. In most ICP wallets, you
                  can find your address in the main dashboard or account section.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Need Additional Help?</CardTitle>
          <CardDescription>We're here to assist you with any questions about setting up your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              Visit Help Center
            </Button>
            <Button variant="outline" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Join Community Forum
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t">
          <p className="text-sm text-muted-foreground">
            Our support team is available Monday through Friday, 9 AM to 5 PM UTC. Typical response time is within 24
            hours.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
