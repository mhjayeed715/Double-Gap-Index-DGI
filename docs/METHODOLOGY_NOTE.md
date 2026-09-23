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
Combines three normalized digital sub-indicators from BBS Population & Housing Census 2022 (Admin 02 Dataset: Internet User, Mobile Phone, Mobile Banking) with equal weighting ($w_j = \frac{1}{3}$):
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
* $P_i$: Percentage of households connected to national electricity grid (BBS Census 2022 Admin 02 Electricity Module).

> **Spatial Join Audit & Registry Skew:** A complete spatial intersection of 78,129 raw LGED school points against district boundaries revealed extreme surveyor sampling skew (e.g. Mymensingh: 4,581 schools vs. Panchagarh: 6 schools, reflecting uneven administrative mapping coverage). Standardized travel-time accessibility models (HeiGIT openrouteservice models over OSM and WorldPop) are therefore used for the composite SAS, while raw LGED facility counts are reported as secondary administrative records.

---

## 3. Dual-Anchor Sensitivity & Robustness

To avoid reliance on an arbitrary single cutoff, DGI employs a Dual-Anchor Framework:

1. **Empirical Dual-Median Baseline (Lead):** Flagged when both $\text{DAS} < 0.3987$ and $\text{SAS} < 0.5829$, isolating **16 Double Gap districts (25.0% of the nation, 37.3M population)**.
2. **Dual-P40 Invariant Core:** Flagged under a tighter dual 40th-percentile cutoff ($\text{DAS} < 0.3672, \text{SAS} < 0.5529$), isolating **9 Core Priority districts (14.1% of the nation)**:
   *Bandarban, Cox's Bazar, Rajbari, Naogaon, Natore, Chapainawabganj, Lalmonirhat, Habiganj, Moulvibazar.*
3. **Buffer Transition Zone:** **7 districts** between P40 and P50 cutoffs:
   *Kishoreganj, Magura, Pabna, Sirajganj, Gaibandha, Thakurgaon, Sunamganj.*

### 3.1 Dual-Percentile Sensitivity Matrix ($N=64$)

Because the digital and physical service dimensions follow asymmetric empirical distributions ($\text{DAS}_{\text{median}} = 0.3987$, $\text{SAS}_{\text{median}} = 0.5829$), evaluating compounded vulnerability requires quantile-anchored thresholds $(P_k \times P_k)$:

| Policy Specification | Quantile Level | DAS Cutoff ($X$) | SAS Cutoff ($Y$) | Flagged Districts | National Share (%) | Key Districts Flagged | Methodological Role |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **Strict Lower Bound** | $P_{20}$ | $< 0.2856$ | $< 0.4972$ | **1** | **1.6%** | Lalmonirhat | Extreme Bivariate Deprivation |
| **Severe Deep Core** | $P_{25}$ | $< 0.3221$ | $< 0.5049$ | **3** | **4.7%** | Bandarban, Chapainawabganj, Lalmonirhat | Acute Outlier Perimeter |
| **High Vulnerability** | $P_{30}$ | $< 0.3365$ | $< 0.5171$ | **6** | **9.4%** | +Naogaon, Natore, Rajbari | Deep Priority Perimeter |
| **High Vulnerability** | $P_{35}$ | $< 0.3583$ | $< 0.5294$ | **8** | **12.5%** | +Habiganj, Moulvibazar | Pre-Core Perimeter |
| **Dual-P40 Invariant Core** | $\mathbf{P_{40}}$ | $\mathbf{< 0.3672}$ | $\mathbf{< 0.5529}$ | **9** | **14.1%** | +Cox's Bazar | **Specification-Invariant Core** |
| **Intermediate Transition** | $P_{45}$ | $< 0.3906$ | $< 0.5630$ | **13** | **20.3%** | +Kishoreganj, Magura, Pabna, Thakurgaon | Core Buffer Transition Band |
| **Dual-Median Baseline** | $\mathbf{P_{50}}$ | $\mathbf{< 0.3987}$ | $\mathbf{< 0.5829}$ | **16** | **25.0%** | +Gaibandha, Sirajganj, Sunamganj | **Empirical Dual-Median Lead** |
| **Broad Surveillance** | $P_{55}$ | $< 0.4096$ | $< 0.5964$ | **21** | **32.8%** | +Bhola, Patuakhali, Pirojpur, Jamalpur, Netrokona | Moderate Vulnerability Outer Band |
| **National Upper Bound** | $P_{60}$ | $< 0.4198$ | $< 0.6102$ | **24** | **37.5%** | +Barguna, Barisal, Kurigram | Extended Surveillance Perimeter |

> **Monotonic Subsetting:** $P_{40}$ (9 districts) $\subset P_{45}$ (13 districts) $\subset P_{50}$ (16 districts) $\subset P_{55}$ (21 districts).

### 3.2 Distributional Asymmetry & Parametric Scalar ($\tau$) Audit

> **Methodological Note on Dual Rulers:** The parametric $\tau$ sweep applies one shared cutoff to both axes simultaneously, which is a much stricter bar on the Service Access axis than a percentile-based cutoff (since SAS is centered near 0.58 while DAS is centered near 0.40). The Dual-Median and Dual-P40 rows instead use each axis's own distribution, which is why they are the primary reported specification.

Evaluating symmetric scalar thresholds ($\text{DAS} < \tau \land \text{SAS} < \tau$) reveals why scalar benchmarks fail:
* At $\tau = 0.40$, 32 districts have $\text{DAS} < 0.40$ ($P_{50}$), but only 3 districts have $\text{SAS} < 0.40$ ($P_{4.7}$) due to 95–99% grid electrification across plain districts. This throttles the joint intersection to 1 district (Bandarban).
* At $\tau = 0.50$, 50 districts have $\text{DAS} < 0.50$, 13 have $\text{SAS} < 0.50$, and 10 meet both.
* At $\tau = 0.5829$ (the SAS median), 32 districts meet both conditions.
* This proves why quantile-anchoring ($P_{50}$ and $P_{40}$) is the only structurally sound specification for asymmetric empirical axes.

---

## 4. Unsupervised Machine Learning & Interpretable Decision Trees

### 4.1 K-Means Cluster Validation ($k=2 \dots 8$)
Applied unsupervised K-Means clustering across the 7 normalized indicator dimensions:
* At $k=4$, the silhouette coefficient is **$0.335$** and inertia is **$8.490$**.
* Groups districts into 4 distinct empirical policy archetypes:
  1. **Rural Agrarian & Coastal Belt** (42 districts: low digital, moderate physical, $\overline{\text{DAS}} = 0.345, \overline{\text{SAS}} = 0.562$).
  2. **Acute Mountain & Off-Grid Deficit** (3 districts: Bandarban, Khagrachhari, Rangamati with severe topographical and energy isolation, $\overline{\text{DAS}} = 0.396, \overline{\text{SAS}} = 0.093$).
  3. **Transitional / Digital Offset** (12 districts: intermediate connectivity, $\overline{\text{DAS}} = 0.498, \overline{\text{SAS}} = 0.623$).
  4. **Metropolitan Urban Belt** (7 districts: Dhaka, Gazipur, Narayanganj, Chattogram, Khulna, Jessore, Sylhet, $\overline{\text{DAS}} = 0.621, \overline{\text{SAS}} = 0.840$).

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

