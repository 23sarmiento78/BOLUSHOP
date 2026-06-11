import type { Collection } from '@/lib/types';

export interface GeminiCollectionProposal {
    name: string;
    description: string;
    slug: string;
    productIds: string[];
    discountType: 'percentage' | 'fixed' | 'none';
    discountValue: number;
    isFeatured: boolean;
    holiday: string;
    reason: string;
}

export type CollectionProposalDraft = GeminiCollectionProposal & {
    selected: boolean;
    image?: string;
};

export function proposalToCollection(proposal: GeminiCollectionProposal): Omit<Collection, 'id'> {
    return {
        name: proposal.name,
        slug: proposal.slug,
        description: proposal.description,
        image: undefined,
        discountType: proposal.discountType,
        discountValue: proposal.discountValue,
        isFeatured: proposal.isFeatured,
        productIds: proposal.productIds,
        holiday: proposal.holiday === 'none' ? undefined : proposal.holiday,
    };
}
