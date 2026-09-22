# The Double Gap Index (DGI): Methodological Specification & Evaluation Framework

**Author:** S. M. Mehrab Hossain Jayeed  
**Working Paper / Technical Memo:** DGI-WP-2026-01 (Revision 4 - Empirical Pilot Release)  
**Affiliation:** Open Development Policy & Interpretable AI Initiative, Bangladesh  
**Repository:** [github.com/mhjayeed715/Double-Gap-Index-DGI](https://github.com/mhjayeed715/Double-Gap-Index-DGI)  
**Date:** September 2026  

---

> ⚠️ **METHODOLOGICAL NOTICE: EMPIRICAL PILOT RELEASE**  
> This paper details the computational architecture, mathematical axioms, and empirical findings of the **Double Gap Index (DGI)** across all 64 administrative districts of Bangladesh. This release is computed directly from 100% CAPI enumeration records of the **BBS Population & Housing Census 2022 (Admin 02 tables, 165.1M individuals)**, standardized travel-time accessibility models from **HeiGIT / UN OCHA HDX**, and administrative facility registries from LGED.

---

## Abstract
Composite vulnerability indices in regional economics frequently aggregate disparate deprivation metrics into a single scalar score. In developing economies, this practice obscures critical compensatory signals between digital connectivity and physical public services. This paper presents the mathematical formulation, sensitivity sweeps, proxy constraints, and interpretability architecture of the **Double Gap Index (DGI)** across the 64 administrative districts of Bangladesh. DGI enforces an axiomatic separation principle: Digital Access and Physical Service Access are evaluated as strictly orthogonal dimensions ($\rho = 0.1742$, Pearson $r = 0.3350$, $\approx 88.8\%$ unshared variance).

Through multi-threshold sensitivity analysis on the empirical census and accessibility data, we establish a **Dual-Anchor Framework**:
1. **Empirical Dual-Median Baseline:** Identifies **16 Double Gap districts (25.0% of the nation, 37.3M citizens / 22.6% of population)** falling below national medians on both axes ($\text{DAS} < 0.3987, \text{SAS} < 0.5829$).
2. **Dual-P40 Invariant Core:** Isolates **9 Core Priority districts (14.1% of the nation)** that remain flagged under both Dual-Median and Dual-P40 cutoffs across Min-Max and Percentile Rank specifications.
3. **Buffer Transition Zone:** Identifies **7 districts** between the P40 core and P50 median cutoffs.

Unsupervised K-Means clustering ($k=4$, Silhouette Score: $0.335$) and an interpretable depth-3 surrogate decision tree achieve **89.1% out-of-sample generalization under Leave-One-Out Cross-Validation (LOOCV: 57/64)** and **98.4% in-sample fidelity (63/64)**, replicating cluster archetypes via four transparent decision rules. We explicitly document internal digital collinearity ($r = +0.7212$ between internet usage and mobile ownership), report gender equity metrics as separate unweighted indicators ($r = 0.9890$ between female and total usage), and disclose an audit of 78,129 LGED school points that revealed surveyor sampling skew, explaining our reliance on standardized travel-time accessibility models for composite scoring.

---

## 1. Motivation & The Axiomatic Separation Principle
When assessing regional equity, traditional development indices blend physical facilities (hospitals, schools) with digital infrastructure (mobile broadband, device ownership) into a single composite number. In Bangladesh's developing geography, this practice obscures two essential compensatory mechanisms:

1. **Digital Offset:** A district with lower hospital proximity can partially mitigate exclusion if mobile broadband and digital literacy are robust—residents leverage telemedicine, mobile financial services (MFS), and remote public consultations.
2. **Physical Cushion:** A rural district with low digital adoption still maintains an essential safety net if healthcare facilities and schools are physically accessible within reach.
3. **The Compounding Double Gap:** When a district suffers from low digital connectivity **AND** low physical service density simultaneously, both survival avenues are severed. Blending these axes into a single score masks this acute compounding failure.

**Axiom (Separation Principle):**
$$\text{Digital Access Score (DAS)} \perp \text{Service Access Score (SAS)}$$
The two scores are maintained strictly as separate, orthogonal dimensions and are never averaged, weighted, or blended into a single scalar. The Spearman rank correlation between DAS and SAS across all 64 districts is $\rho = 0.1742$ (Pearson $r = 0.3350$), demonstrating that approximately **$88.8\%$ of the cross-district variance is orthogonal and unshared**.

---

## 2. Mathematical Formulation & Normalization

### 2.1 Sub-Indicator Normalization
For each district $i \in \{1, \dots, 64\}$ and indicator $x$:
$$\text{norm}(x_i) = \frac{x_i - \min(X)}{\max(X) - \min(X)}$$

### 2.2 Digital Access Score (DAS)
Combines three normalized digital sub-indicators from BBS Population & Housing Census 2022 (Tables P24, P25, P27) with equal weighting ($w_j = \frac{1}{3}$):
$$\text{DAS}_i = \frac{1}{3} \cdot \text{norm}(I_i) + \frac{1}{3} \cdot \text{norm}(M_i) + \frac{1}{3} \cdot \text{norm}(B_i)$$
* $I_i$: Percentage of population aged 15+ using internet.
* $M_i$: Percentage of population aged 15+ owning a mobile phone.
* $B_i$: Percentage of population aged 15+ holding a mobile banking account.

> **Gender Indicator Resolution & Internal Collinearity:**
> 1. **Gender Term:** Female internet usage correlates $r = 0.9890$ ($\rho = 0.9896$) with total internet usage across all 64 districts, and gender parity ratio correlates $r = 0.9228$. Folding female rate or parity into the composite score would simply double-count internet penetration. The gender term was dropped from the composite score and is reported as unweighted contextual metrics (`female_usage_pct`, `male_usage_pct`, `gender_gap_pct`) on district dossiers.
> 2. **Internal Collinearity:** Within the digital score, Internet Usage and Mobile Phone ownership correlate $r = +0.7212$ ($\rho = 0.6654$). This shared device/connectivity variance is explicitly disclosed. In contrast, Mobile Banking ($r = -0.1615$) provides an orthogonal measure of digital economic participation.

### 2.3 Service Access Score (SAS)
Measures physical infrastructure accessibility from standardized HeiGIT travel-time accessibility models and BBS Census 2022 electrification records:
$$\text{SAS}_i = \frac{1}{3} \cdot \text{norm}(H_i) + \frac{1}{3} \cdot \text{norm}(E_i) + \frac{1}{3} \cdot \text{norm}(P_i)$$
* $H_i$: Percentage of population within 30 minutes travel time of a healthcare facility / hospital (HeiGIT HDX model).
* $E_i$: Percentage of population within 5 km of a secondary school (HeiGIT HDX model).
* $P_i$: Percentage of households connected to national electricity grid (BBS Census 2022 Table P01).

> **Spatial Join Audit & Registry Skew:** A complete spatial intersection of 78,129 raw LGED school points against district boundaries revealed extreme surveyor sampling skew (e.g. Mymensingh: 4,581 schools vs. Panchagarh: 6 schools, reflecting uneven administrative mapping coverage). Standardized travel-time accessibility models (HeiGIT openrouteservice models over OSM and WorldPop) are therefore used for the composite SAS, while raw LGED facility counts are reported as secondary administrative records.

---

## 3. Dual-Anchor Sensitivity & Robustness

To avoid reliance on an arbitrary single cutoff, DGI employs a Dual-Anchor Framework:

1. **Empirical Dual-Median Baseline (Lead):** Flagged when both $\text{DAS} < 0.3987$ and $\text{SAS} < 0.5829$, isolating **16 Double Gap districts (25.0% of the nation, 37.3M population)**.
2. **Dual-P40 Invariant Core:** Flagged under a tighter dual 40th-percentile cutoff ($\text{DAS} < 0.3672, \text{SAS} < 0.5529$), isolating **9 Core Priority districts (14.1% of the nation)**:
   *Bandarban, Cox's Bazar, Rajbari, Naogaon, Natore, Chapainawabganj, Lalmonirhat, Habiganj, Moulvibazar.*
3. **Buffer Transition Zone:** **7 districts** between P40 and P50 cutoffs:
   *Kishoreganj, Magura, Pabna, Sirajganj, Gaibandha, Thakurgaon, Sunamganj.*

### Multi-Threshold Sensitivity Matrix ($N=64$)

| Policy Specification | Threshold Criteria | Flagged Districts | National Share (%) | Key Districts Flagged | Methodological Classification |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Dual-P40 Invariant Core** | $\text{DAS} < 0.3672 \land \text{SAS} < 0.5529$ | **9** | **14.1%** | Bandarban, Cox's Bazar, Rajbari, Naogaon, Natore... | **Specification-Invariant Core** |
| **Dual-Median Baseline** | $\text{DAS} < 0.3987 \land \text{SAS} < 0.5829$ | **16** | **25.0%** | +7 Buffer: Kishoreganj, Magura, Pabna, Sirajganj... | **Empirical Dual-Median Lead** |
| $\tau = 0.30$ | Parametric absolute cutoff | 0 | 0.0% | None below both absolute 0.30 | Strict Lower Bound |
| $\tau = 0.35$ | Parametric absolute cutoff | 1 | 1.6% | Bandarban | Extreme Acute Outlier |
| $\tau = 0.40$ | Parametric absolute cutoff | 1 | 1.6% | Bandarban | Severe Acute Zone |
| $\tau = 0.45$ | Parametric absolute cutoff | 5 | 7.8% | Bandarban, Khagrachhari, Rangamati, Faridpur, Naogaon | High Vulnerability Perimeter |
| $\tau = 0.50$ | Parametric absolute cutoff | 10 | 15.6% | +Gopalganj, Rajbari, Magura, Natore, Lalmonirhat | Broad Surveillance Perimeter |

---

## 4. Unsupervised Machine Learning & Interpretable Decision Trees

### 4.1 K-Means Cluster Validation ($k=2 \dots 8$)
Applied unsupervised K-Means clustering across the 7 normalized indicator dimensions:
* At $k=4$, the silhouette coefficient is **$0.335$** and inertia is **$8.490$**.
* Groups districts into 4 distinct policy archetypes: Severe Deprivation (42), Rural Safety Net / Hill Tracts (3: Bandarban, Khagrachhari, Rangamati), Transitional Offset (12), and Metropolitan Belt (7).

### 4.2 Shallow Surrogate Decision Tree (LOOCV: 89.1% / In-Sample: 98.4%)
A depth-3 surrogate decision tree maps the 7 indicators to cluster membership:
* **Leave-One-Out Cross-Validation (LOOCV):** Achieving **89.1% generalization accuracy (57/64 districts correctly classified out-of-sample)**.
* **In-Sample Fidelity:** **98.4% (63/64 districts correctly reproduced)**.
* Replicates clusters via 4 transparent, auditable decision rules.

---

## 5. Methodological Limitations & Regression Guards

### 5.1 Known Proxy Constraints
1. **LGED Facility Registry Sampling Bias:** Spatial intersection of 78,129 points revealed uneven administrative mapping coverage across divisions. Travel-time access models from HeiGIT/HDX prevent surveyor omissions from penalizing rural districts.
2. **Digital Indicator Collinearity:** Internet penetration and mobile phone ownership correlate $r = +0.7212$ ($\rho = 0.6654$).
3. **Gender Parity Near-Collinearity:** Female internet usage correlates $r = 0.9890$ with total internet usage across all 64 districts in Census 2022.
4. **Formal Transit vs. Rural Mobility:** Road accessibility models evaluate motorized travel times. In haor and delta districts, seasonal monsoons and informal water transport heavily impact real travel times.
5. **Census Enumeration Horizon:** BBS Population Census 2022 reflects 100% CAPI enumeration from June 2022.

### 5.2 Role of Automated Test Suites
The 12 automated unit tests in `tests/*.test.mjs` serve as **internal consistency and regression guards** (verifying score boundaries, mathematical invariants, and zero-fabrication rules). They confirm that the software correctly implements the defined empirical formulas.

---

## 6. Citation & Reproducibility
All datasets, normalization scripts, clustering routines, and test suites are open source:
```bibtex
@techreport{jayeed2026doublegap,
  author    = {Jayeed, S. M. Mehrab Hossain},
  title     = {Double Gap Index (DGI): Mapping Compounded Digital and Physical Service Exclusion in Bangladesh},
  institution = {Open Development Policy Initiative},
  year      = {2026},
  url       = {https://github.com/mhjayeed715/Double-Gap-Index-DGI}
}
```

