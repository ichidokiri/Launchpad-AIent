"use client";
/**
 * ! INSTRUCTIONS
 * 1. the createFee and initialAmount are passed down imperatively from the parent componen
 * 2. when submitting the form, the agent is posted to the blockchain and then the txHash is returned
 * 3. the txHash is used to update the agent with the contract address once it comes through to the backend
 */
import type React from "react";
import { formatEther } from "viem";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Loader2, Code, FileText } from "lucide-react";
import { Ethereum } from "@/components/icons/ethereum";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getAgentCreateDataQueryOptions } from "@/app/create/queries";
import { useWriteAgentFactoryDeployErc20Token } from "@/generated";
import { useWaitForTransactionReceipt } from "wagmi";
import { usePonderQuery } from "@ponder/react";
import { eq } from "@ponder/client";
import { eventCreatePool } from "@/ponder/ponder.schema";
export default function CreateAgentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  // const [contractAddress, setContractAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    x: "",
    youtube: "",
    discord: "",
    github: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // fetch the create fee and initial amount
  const { data: agentCreateData } = useQuery(getAgentCreateDataQueryOptions);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setAvatar(base64);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  // TODO: pass in the necessary data
  const handleSubmit = async (params: any) => {
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!name) {
        toast.error("Agent name is required");
        setIsSubmitting(false);
        return;
      }

      if (!symbol) {
        toast.error("Symbol is required");
        setIsSubmitting(false);
        return;
      }

      if (!agentCreateData?.createFee) {
        toast.error("Issue price is required");
        setIsSubmitting(false);
        return;
      }

      if (!agentCreateData?.initialAmount) {
        toast.error("Token amount is required");
        setIsSubmitting(false);
        return;
      }

      if (!avatar) {
        toast.error("Avatar image is required");
        setIsSubmitting(false);
        return;
      }

      // Prepare the data
      const agentData = {
        name,
        symbol,
        price: agentCreateData?.createFee
          ? formatEther(agentCreateData?.createFee)
          : "",
        tokenAmount: formatEther(agentCreateData?.initialAmount),
        description,
        avatar,
        txHash, // we need to pass the txHash so we can update the agent with the contract address once it comes through
        socialLinks,
      };

      console.log("Submitting agent data:", agentData);

      // Send the data to the backend
      // TODO: pass in the necessary data
      const response = await fetch("/api/ai-agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to create agent");
      }

      toast.success("AI Agent created successfully!");

      // Reset form after successful creation
      setName("");
      setSymbol("");
      setDescription("");
      setAvatar(null);
      setSocialLinks({
        x: "",
        youtube: "",
        discord: "",
        github: "",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating AI Agent:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create AI Agent"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { writeContractAsync: deployAgent, data: txHash } =
    useWriteAgentFactoryDeployErc20Token({
      mutation: {
        onSuccess: async (txHash) => {
          await handleSubmit(txHash);
          toast.success("Your agent is being deployed to the blockchain...");
        },
      },
    });

  const { data: agentInfo } = usePonderQuery({
    enabled: !!txHash,
    queryFn: (db) =>
      db
        .select()
        .from(eventCreatePool)
        .where(eq(eventCreatePool.txHash, txHash)),
  });

  useEffect(() => {
    if (agentInfo?.length) {
      const {
        agentAddress,
        userAddress,
        txHash,
        chainId,
        virtualEthReserves,
        virtualTokenReserves,
      } = agentInfo[0];
      handleSubmit();
      // !!!! PASS NECESSARY DATA TO THE SUBMIT FUNCTION
    }
  }, [agentInfo]);

  return (
    <div className="h-screen overflow-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Create AI Agent</h2>
      </div>

      <div className="p-4">
        {/* Tabs */}
        <div className="flex mb-4 border border-border rounded-md overflow-hidden">
          <button
            className={`flex-1 py-2 text-sm ${activeTab === "details" ? "bg-accent text-white" : "bg-card"}`}
            onClick={() => setActiveTab("details")}
          >
            Agent Details
          </button>
          <button
            className={`flex-1 py-2 text-sm ${activeTab === "preview" ? "bg-accent text-white" : "bg-card"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>

        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Agent Avatar */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center text-white">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Agent Avatar (Required)
              </h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-gray-700 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
              >
                {avatar ? (
                  <div className="relative h-24 w-24 mb-2">
                    <Image
                      src={avatar || "/placeholder.svg"}
                      alt="Avatar preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                  required
                />
                <span className="text-sm text-gray-400">
                  {avatar ? "Change Avatar" : "Upload Avatar (click or drag)"}
                </span>
                {isUploading && (
                  <Loader2 className="mt-2 h-5 w-5 animate-spin text-gray-400" />
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    AI Agent Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-card border border-border rounded-md p-2 text-sm"
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full bg-card border border-border rounded-md p-2 text-sm"
                    placeholder="$SYMBOL"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Issue Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                      <Ethereum className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      value={
                        agentCreateData?.createFee
                          ? formatEther(agentCreateData?.createFee)
                          : ""
                      }
                      className="w-full bg-card border border-border rounded-md p-2 pl-7 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Token Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      #
                    </span>
                    <input
                      type="number"
                      value={
                        agentCreateData?.initialAmount
                          ? formatEther(agentCreateData?.initialAmount)
                          : ""
                      }
                      readOnly
                      className="w-full bg-card border border-border rounded-md p-2 pl-7 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Description
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-card border border-border rounded-md p-2 text-sm min-h-[100px]"
                placeholder="Describe what your AI agent does..."
              />
            </div>

            {/* Smart Contract  */}
            {/* DISABLED */}
            {/* <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Smart Contract
              </h3>
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="w-full bg-card border border-border rounded-md p-2 text-sm"
                placeholder="Contract Address (Optional)"
              />
            </div> */}

            {/* Social Links */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                  />
                </svg>
                Social Links
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground opacity-70">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={socialLinks.x}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, x: e.target.value })
                    }
                    className="w-full bg-card border border-border rounded-md p-2 pl-10 text-sm text-foreground"
                    placeholder="X (Twitter)"
                  />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground opacity-70">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 00-5.487 0 12.36 12.36 0 00-.617-1.23A.077.077 0 008.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 00.031.055 20.03 20.03 0 005.993 2.98.078.078 0 00.084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.229 13.229 0 01-1.872-.878.075.075 0 01-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 01.078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 01.079.009c.12.098.245.195.372.288a.075.075 0 01-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 00-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 00.084.028 19.963 19.963 0 006.002-2.981.076.076 0 00.032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 00-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={socialLinks.discord}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        discord: e.target.value,
                      })
                    }
                    className="w-full bg-card border border-border rounded-md p-2 pl-10 text-sm text-foreground"
                    placeholder="Discord"
                  />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground opacity-70">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={socialLinks.youtube}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        youtube: e.target.value,
                      })
                    }
                    className="w-full bg-card border border-border rounded-md p-2 pl-10 text-sm text-foreground"
                    placeholder="YouTube"
                  />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground opacity-70">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={socialLinks.github}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, github: e.target.value })
                    }
                    className="w-full bg-card border border-border rounded-md p-2 pl-10 text-sm text-foreground"
                    placeholder="GitHub"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                deployAgent({
                  args: [name, symbol],
                  value: agentCreateData?.createFee,
                })
              }
              disabled={isSubmitting || !name || !symbol}
              className="w-full bg-accent text-white py-2 rounded-md text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create AI Agent"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview content */}
            <div className="bg-card rounded-md p-4">
              <div className="flex items-center space-x-3">
                {avatar ? (
                  <div className="relative h-12 w-12">
                    <Image
                      src={avatar || "/placeholder.svg"}
                      alt="Agent preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-accent-foreground">
                      {name.charAt(0) || "A"}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-card-foreground">
                    {name || "AI Agent Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {symbol || "$SYMBOL"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Issue Price:
                </span>
                <span className="text-sm text-card-foreground">
                  {agentCreateData?.createFee
                    ? formatEther(agentCreateData?.createFee)
                    : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Token Amount:
                </span>
                <span className="text-sm text-card-foreground">
                  {agentCreateData?.initialAmount
                    ? formatEther(agentCreateData?.initialAmount)
                    : "0"}
                </span>
              </div>
            </div>

            {description && (
              <div className="bg-card rounded-md p-4">
                <h4 className="text-sm font-medium mb-2 text-card-foreground">
                  Description
                </h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
