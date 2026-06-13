-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "description" TEXT,
    "contextWindow" INTEGER,
    "maxOutputTokens" INTEGER,
    "releaseDate" TIMESTAMP(3),
    "isExperimental" BOOLEAN NOT NULL DEFAULT false,
    "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
    "modelFamily" TEXT,
    "paramSize" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelCapability" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "ModelCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "developerId" TEXT,
    "website" TEXT,
    "docsUrl" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "apiFormat" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "inputPricePerMillion" DOUBLE PRECISION NOT NULL,
    "outputPricePerMillion" DOUBLE PRECISION NOT NULL,
    "cachedInputPricePerMillion" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "source" TEXT NOT NULL DEFAULT 'api',
    "sourceUrl" TEXT,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingHistory" (
    "id" TEXT NOT NULL,
    "pricingId" TEXT NOT NULL,
    "inputPricePerMillion" DOUBLE PRECISION NOT NULL,
    "outputPricePerMillion" DOUBLE PRECISION NOT NULL,
    "cachedInputPricePerMillion" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Developer_name_key" ON "Developer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_slug_key" ON "Developer"("slug");

-- CreateIndex
CREATE INDEX "Developer_slug_idx" ON "Developer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE INDEX "Model_slug_idx" ON "Model"("slug");

-- CreateIndex
CREATE INDEX "Model_developerId_idx" ON "Model"("developerId");

-- CreateIndex
CREATE INDEX "Model_modelFamily_idx" ON "Model"("modelFamily");

-- CreateIndex
CREATE INDEX "Model_name_idx" ON "Model"("name");

-- CreateIndex
CREATE INDEX "Model_contextWindow_idx" ON "Model"("contextWindow");

-- CreateIndex
CREATE UNIQUE INDEX "Capability_slug_key" ON "Capability"("slug");

-- CreateIndex
CREATE INDEX "Capability_slug_idx" ON "Capability"("slug");

-- CreateIndex
CREATE INDEX "ModelCapability_modelId_idx" ON "ModelCapability"("modelId");

-- CreateIndex
CREATE INDEX "ModelCapability_capabilityId_idx" ON "ModelCapability"("capabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelCapability_modelId_capabilityId_key" ON "ModelCapability"("modelId", "capabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "Provider_slug_idx" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "Provider_status_idx" ON "Provider"("status");

-- CreateIndex
CREATE INDEX "Pricing_modelId_idx" ON "Pricing"("modelId");

-- CreateIndex
CREATE INDEX "Pricing_providerId_idx" ON "Pricing"("providerId");

-- CreateIndex
CREATE INDEX "Pricing_inputPricePerMillion_idx" ON "Pricing"("inputPricePerMillion");

-- CreateIndex
CREATE INDEX "Pricing_outputPricePerMillion_idx" ON "Pricing"("outputPricePerMillion");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_modelId_providerId_key" ON "Pricing"("modelId", "providerId");

-- CreateIndex
CREATE INDEX "PricingHistory_pricingId_recordedAt_idx" ON "PricingHistory"("pricingId", "recordedAt");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCapability" ADD CONSTRAINT "ModelCapability_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCapability" ADD CONSTRAINT "ModelCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingHistory" ADD CONSTRAINT "PricingHistory_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
