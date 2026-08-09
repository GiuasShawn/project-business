/**
 * Static catalog data for the Phase 05 design foundation.
 *
 * The product/domain backend is out of scope for this phase (see PHASES.md).
 * This module provides the minimal mock surface needed to demonstrate the
 * Loom catalog, landing wall, and storefront editor visuals. It is NOT a
 * stand-in for production data — replace with the Products domain API when
 * that phase lands.
 *
 * Image URLs are the product photography used by the approved Stitch screens
 * (design/*). Every <img> renders over a dark tonal fallback so the design
 * holds even if an image cannot be fetched.
 */

export type CatalogCategory = 'Apparel' | 'Accessories' | 'Home & Design' | 'Electronics'

export type ProductBadge = 'Best Seller' | 'New Arrival' | 'Exclusive' | 'Limited'

export interface CatalogProduct {
  id: string
  name: string
  brand: string
  category: CatalogCategory
  /** MRP in INR */
  price: number
  /** Commission rate, percent. Core Loom concept — always visible on the card. */
  commissionRate: number
  image: string
  badge?: ProductBadge
  inStock: boolean
}

const img = {
  keyboard:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgiiyINqyWWaKWZ0yLJXmLY1U-Lrr6ZV-ahgnYsEKDoTevBYLDECK-oaqeV0ZRUPtsDhHJmmiW5tgU2WdPx7B7X2bdjGn3udpw_mcjYZxulJI0y_QmamD5xjje3KyZ5Vu5Ld2STHWcLZD0uZKmwuc5dkFyvPZQZu5WEy4N2Y4mr_i74vdH1F_X1ASL1yfqIoiq0srW7ajw4OGjbsgDPsxS8tEivNE90TQ4HmYmWNpCE5RiIB9uG1K',
  vase: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC95NTK8DwYYAbu5kIpTkuVeLyH_WB9mYWLbpmvnZMV64Kp75nGhyvcU2AFe-4k5fY5y_40T14IwPApbgmwqSO29BM-68H3EIDYAu3MndZqVvk9UEwROxCckn-1OJ7QaPKCJGpnFqyXXExNix0PPQjiCoB8_zhK3tHhBLne8r8tmK3L8mnXvcApmqXw2HZslrhlQqymujXqdd8neYBTdGHvG6dDmTJQ1SukqO9JSO5devun-eCeOvr-',
  wallet:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCcxzPXYZyjF-svBbEuC1MXFXg-VW5krNxZ4fIIzZDocvxSFIoCIIfvVsEzcTTbTZkLHmicZ8DQD7vgt_GjIO6vKAiwAueYxTqWUvKbK0IG04iL4xUAD7LNauMl-VSCKc9dUrw2_GoMBaAkoTcYB7EQtQL2MnBlZ8Cmv6MvrC1OUKFR2u_p0AjszGDiQPDW3PSDgqkiG7iXz_8_6JjcgMuTEYSAAjsj20kfttPXkbniqLOIX9tu5nVt',
  espresso:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuANeDEnUqoS9PntTOcotjxBYqL8H5REGxRxKOMLxZlUoNw81lToCGIckaXPwEiNhHgrNP0Ay2dQd8uGcmsc80Q6xUhXi2g7EOJTnxNlBPlOhEpyh8i49zQMFOZ4TaGK7jMFslU3SNolt4ijAkexGDhojJvYvExQcbLAa-xuarFfXKgLDHmWywDZqPODcMXa0LCQftKJbr1O7CwFLQ8za3NmY_umjptJO_E4MN44Vqr3ZHHSZd4VBqjk',
  tote: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByGaqs0nR-UbNVbOtCo2VPqfkW0kBdsuoqLYqy1O4xdFsSIXD390Nr07vfj31dROaujFT-Y1fHg9xYwnWHoEDXMKRsij2JZnGDJw1Y5FgBM_u11pU2gwfXBVu4h8MPLnXA7FW58LrxLyZgyXDqhiMF2bCF1CPQq10r1roGZb1EHEmwJnQulhTe8JTbe0-XNrUfn3_SBhxvCRYwudqk9orllsVlaYB9DD1VeJC8BMbi8VkAGeNMXciE',
  pourOver:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBdyz3sW4kw9RN5ZiRjhpYrhQBkP0FNqOS7KoNaEo3z2OTdH2sMYscGT5s-alUzynPyUr5amJNzBHaez0G2t5apS7lTN4vtpKQGAPeB-Alhp46xBXttpYRnjVO_g3lvbvkzL8GUqNVWcdU7hJa0TinUXCkV8xY0dorhHcSUdVTToCFOB1VZYRR3LbM7U2sYTyCqr2dTT8kRab2ahYHtYbxbdaQ-QV5qOYsBF3tJwH6FTd8qgmsLw7yG',
  candle:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAQN73idSdvKxwLX3ZQxfjFZs5sb5Aj_t5Gq7Dnn5fYUlBUAXo4fNwNEDc2uteKV75nD0-kjLh8EA0UP5Zhqx_0E2pXFLeMgp6OlpsajquZrB5IUUaPUsWGr-SVWvxCC03PgZVVpd7D27Jv9YKFaO0LIbc4TZ045FYq9cPErMHyLoo_WU3QdRQM9EM94hhCtuW-nONV7lm-rvctX_9p5mCo8rwOmaeNifMQohhbNh2FZ57rEZKIFrUQ',
  knit: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM2f09sSI85KsJyKbQOJ7388Vr_W6043f2Ofx0_6gsBxQcVHN0wpaPA0PDNSbrUZPwBWbRNDjNO-jqYUMF3BhnzRw4v8bD7Aw-TvgGj2ZoHzMFR3h5Vru-oFfn__Ce-waQ9gRvWg3c4lZD2J7ttW3kvHLqJ7Z10KCAetZ1EJW5SDMUlDq0xqAlKjvW-EIec5JBsf-P7noXQiD4fCn1mEfwTXmcXCJVFF_mcyzAs-hrvPxwpD4XjN_B',
  handbag:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCb_LVwgeh4pQcMp8s2JAvTpKPeRCKkmTcxuySIJSWxUbe27guAEPT-UCz6KFi9FpIc5Vx7Jc9YJ-4ptw9UTw8z2pd_M1A9xJ2lU1Ppl5aTw8ZIbbSv23RMOcKie1aaaTkCmWoKGHFP8Avbc7u5T_U_QcW3ttzDXnOOrKHNMQ14dOHilGoiN0V4rdM2nnCoPg_mZjjaIK_Ryu5e7NEhu65iAgA4onW9e725Gmwd5KcZr3sdldddd_ou',
  boot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCAqat3q5zipGqDG6PyA_0bKSH24v69m2Y4CKQ1YxLGgoovdoh6vb11Sw9mIyGdBp7zPxGnebhDsrYElquguhUjUHFGuJwCA-5s7ro64U-Ig4K1sNzCItNNZKPb08a-1gK9IG5ZcTTnpIyFwmAg3TbIldBnNtO5VA9fr4vI2jyN5TRoQrcr8fQSAyXACWJNJZUzKyG5W80XYpverpXVrhdKw1u_ySoUdvxmuFn4eayaSLSsSBQ1bNE',
  ring: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABUrJT1gHoWD1kVfH7Ey26ivpJJCt0Z8_Xcjg-W4zWYVJBtX2HrjQaRxhyyn73-yAH5nduTQN5fHzkMkOwH07RxcH-i6XQVlk20KO7pVsPUokgflVKyCL-VeUwXvOzxPPcdduEyyUtA7p9Xb3jy0lc8AjopaP4Zsqd3bx8ynbtduF9qzSeZe9dSflqlLAdiagv8H2KJ4sRg0Nmc0NDHX2n5K-ZsB3yo4oMItQYyUrb_zDjBpoVImlU',
  editorial:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2feWjFi9Xd38fBalEy0sE3EnK5IAHKFRdk_759usxUtDri7423lANll3P3CezDD-cRkmK-hhHzPzZurSgfhn9ZbzqsUPFVA56AmXGuY4uIvOJ3ZMUSseBLB0WxeyIkwbbXQQoSwGoooZ5xp5OOAnhdkfoIVPm6TDosqwODZr5x-agPzkaTx_jb77ik_mIRf_vx7szF7ONInnBFX2Vw2A0xMmVEDDIDyziY9iKEtBtFNvLRAuks37',
}

export const catalogImages = Object.values(img)

export const catalogProducts: CatalogProduct[] = [
  {
    id: 'prod-001',
    name: 'Apex Pro TKL Mechanical',
    brand: 'Forge Works',
    category: 'Electronics',
    price: 12499,
    commissionRate: 12,
    image: img.keyboard,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'prod-002',
    name: 'Obsidian Ceramic Vase',
    brand: 'Forma Home',
    category: 'Home & Design',
    price: 4200,
    commissionRate: 18,
    image: img.vase,
    badge: 'New Arrival',
    inStock: true,
  },
  {
    id: 'prod-003',
    name: 'Nomad Leather Passport',
    brand: 'Studio Collective',
    category: 'Accessories',
    price: 3850,
    commissionRate: 22,
    image: img.wallet,
    inStock: true,
  },
  {
    id: 'prod-004',
    name: 'Linea Micra Titanium',
    brand: 'Forge Works',
    category: 'Electronics',
    price: 245000,
    commissionRate: 5,
    image: img.espresso,
    badge: 'Limited',
    inStock: false,
  },
  {
    id: 'prod-005',
    name: 'Structured Minimal Tote',
    brand: 'Studio Collective',
    category: 'Accessories',
    price: 4999,
    commissionRate: 15,
    image: img.tote,
    badge: 'New Arrival',
    inStock: true,
  },
  {
    id: 'prod-006',
    name: 'Ceramic Pour-Over Kit',
    brand: 'Forma Home',
    category: 'Home & Design',
    price: 2450,
    commissionRate: 20,
    image: img.pourOver,
    inStock: true,
  },
  {
    id: 'prod-007',
    name: 'Forged Iron Holder',
    brand: 'Raw Elements',
    category: 'Home & Design',
    price: 1299,
    commissionRate: 18,
    image: img.candle,
    inStock: true,
  },
  {
    id: 'prod-008',
    name: 'Oversized Heavy Knit',
    brand: 'Studio Collective',
    category: 'Apparel',
    price: 6800,
    commissionRate: 12,
    image: img.knit,
    inStock: true,
  },
  {
    id: 'prod-009',
    name: 'Obsidian Structure Tote',
    brand: 'Noir Atelier',
    category: 'Accessories',
    price: 104500,
    commissionRate: 15,
    image: img.handbag,
    badge: 'Exclusive',
    inStock: true,
  },
  {
    id: 'prod-010',
    name: 'Tactical Tread Boot',
    brand: 'Raw Elements',
    category: 'Apparel',
    price: 73500,
    commissionRate: 12,
    image: img.boot,
    inStock: true,
  },
  {
    id: 'prod-011',
    name: 'Molten Silver Signet',
    brand: 'Noir Atelier',
    category: 'Accessories',
    price: 37200,
    commissionRate: 20,
    image: img.ring,
    inStock: true,
  },
  {
    id: 'prod-012',
    name: 'Structural Tailored Blazer',
    brand: 'Studio Collective',
    category: 'Apparel',
    price: 9800,
    commissionRate: 14,
    image: img.editorial,
    badge: 'Best Seller',
    inStock: true,
  },
]

export const catalogCategories: CatalogCategory[] = [
  'Apparel',
  'Accessories',
  'Home & Design',
  'Electronics',
]

export interface CommissionBand {
  id: string
  label: string
  min?: number
  max?: number
}

export const commissionBands: CommissionBand[] = [
  { id: 'all', label: 'All Rates' },
  { id: 'low', label: '0 – 5%', min: 0, max: 5 },
  { id: 'mid', label: '5 – 15%', min: 5, max: 15 },
  { id: 'premium', label: '15%+ (Premium)', min: 15 },
]

export type SortOption = 'featured' | 'commission-desc' | 'price-asc' | 'price-desc' | 'newest'

export const sortOptions: Array<{ id: SortOption; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'commission-desc', label: 'Highest Commission' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
]

/** Format a number as Indian Rupees, e.g. ₹2,45,000 */
export function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}
