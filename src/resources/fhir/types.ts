/**
 * Tipe-tipe untuk FHIR Resource Builder
 * Menyediakan type-safe access ke semua resource FHIR R4
 */
import type * as fhir4 from 'fhir/r4';
import type { OperationOutcome } from 'fhir/r4';

/**
 * Custom error class untuk FHIR OperationOutcome responses
 * Menyediakan type-safe access ke data OperationOutcome
 */
export class FhirOperationOutcomeError extends Error {
  public readonly operationOutcome: OperationOutcome;
  public readonly status: number;

  constructor(operationOutcome: OperationOutcome, status: number) {
    const message =
      operationOutcome.issue?.[0]?.diagnostics ??
      operationOutcome.issue?.[0]?.details?.text ??
      'FHIR OperationOutcome error';
    super(message);
    this.name = 'FhirOperationOutcomeError';
    this.operationOutcome = operationOutcome;
    this.status = status;
  }
}

/**
 * Map dari nama resource FHIR ke tipe TypeScript-nya
 * Memungkinkan type inference berdasarkan string resource type
 */
export interface FhirResourceMap {
  Account: fhir4.Account;
  ActivityDefinition: fhir4.ActivityDefinition;
  AdverseEvent: fhir4.AdverseEvent;
  AllergyIntolerance: fhir4.AllergyIntolerance;
  Appointment: fhir4.Appointment;
  AppointmentResponse: fhir4.AppointmentResponse;
  AuditEvent: fhir4.AuditEvent;
  Basic: fhir4.Basic;
  Binary: fhir4.Binary;
  BiologicallyDerivedProduct: fhir4.BiologicallyDerivedProduct;
  BodyStructure: fhir4.BodyStructure;
  Bundle: fhir4.Bundle;
  CapabilityStatement: fhir4.CapabilityStatement;
  CarePlan: fhir4.CarePlan;
  CareTeam: fhir4.CareTeam;
  CatalogEntry: fhir4.CatalogEntry;
  ChargeItem: fhir4.ChargeItem;
  ChargeItemDefinition: fhir4.ChargeItemDefinition;
  Claim: fhir4.Claim;
  ClaimResponse: fhir4.ClaimResponse;
  ClinicalImpression: fhir4.ClinicalImpression;
  CodeSystem: fhir4.CodeSystem;
  Communication: fhir4.Communication;
  CommunicationRequest: fhir4.CommunicationRequest;
  CompartmentDefinition: fhir4.CompartmentDefinition;
  Composition: fhir4.Composition;
  ConceptMap: fhir4.ConceptMap;
  Condition: fhir4.Condition;
  Consent: fhir4.Consent;
  Contract: fhir4.Contract;
  Coverage: fhir4.Coverage;
  CoverageEligibilityRequest: fhir4.CoverageEligibilityRequest;
  CoverageEligibilityResponse: fhir4.CoverageEligibilityResponse;
  DetectedIssue: fhir4.DetectedIssue;
  Device: fhir4.Device;
  DeviceDefinition: fhir4.DeviceDefinition;
  DeviceMetric: fhir4.DeviceMetric;
  DeviceRequest: fhir4.DeviceRequest;
  DeviceUseStatement: fhir4.DeviceUseStatement;
  DiagnosticReport: fhir4.DiagnosticReport;
  DocumentManifest: fhir4.DocumentManifest;
  DocumentReference: fhir4.DocumentReference;
  EffectEvidenceSynthesis: fhir4.EffectEvidenceSynthesis;
  Encounter: fhir4.Encounter;
  Endpoint: fhir4.Endpoint;
  EnrollmentRequest: fhir4.EnrollmentRequest;
  EnrollmentResponse: fhir4.EnrollmentResponse;
  EpisodeOfCare: fhir4.EpisodeOfCare;
  EventDefinition: fhir4.EventDefinition;
  Evidence: fhir4.Evidence;
  EvidenceVariable: fhir4.EvidenceVariable;
  ExampleScenario: fhir4.ExampleScenario;
  ExplanationOfBenefit: fhir4.ExplanationOfBenefit;
  FamilyMemberHistory: fhir4.FamilyMemberHistory;
  Flag: fhir4.Flag;
  Goal: fhir4.Goal;
  GraphDefinition: fhir4.GraphDefinition;
  Group: fhir4.Group;
  GuidanceResponse: fhir4.GuidanceResponse;
  HealthcareService: fhir4.HealthcareService;
  ImagingStudy: fhir4.ImagingStudy;
  Immunization: fhir4.Immunization;
  ImmunizationEvaluation: fhir4.ImmunizationEvaluation;
  ImmunizationRecommendation: fhir4.ImmunizationRecommendation;
  ImplementationGuide: fhir4.ImplementationGuide;
  InsurancePlan: fhir4.InsurancePlan;
  Invoice: fhir4.Invoice;
  Library: fhir4.Library;
  Linkage: fhir4.Linkage;
  List: fhir4.List;
  Location: fhir4.Location;
  Measure: fhir4.Measure;
  MeasureReport: fhir4.MeasureReport;
  Media: fhir4.Media;
  Medication: fhir4.Medication;
  MedicationAdministration: fhir4.MedicationAdministration;
  MedicationDispense: fhir4.MedicationDispense;
  MedicationKnowledge: fhir4.MedicationKnowledge;
  MedicationRequest: fhir4.MedicationRequest;
  MedicationStatement: fhir4.MedicationStatement;
  MedicinalProduct: fhir4.MedicinalProduct;
  MedicinalProductAuthorization: fhir4.MedicinalProductAuthorization;
  MedicinalProductContraindication: fhir4.MedicinalProductContraindication;
  MedicinalProductIndication: fhir4.MedicinalProductIndication;
  MedicinalProductIngredient: fhir4.MedicinalProductIngredient;
  MedicinalProductInteraction: fhir4.MedicinalProductInteraction;
  MedicinalProductManufactured: fhir4.MedicinalProductManufactured;
  MedicinalProductPackaged: fhir4.MedicinalProductPackaged;
  MedicinalProductPharmaceutical: fhir4.MedicinalProductPharmaceutical;
  MedicinalProductUndesirableEffect: fhir4.MedicinalProductUndesirableEffect;
  MessageDefinition: fhir4.MessageDefinition;
  MessageHeader: fhir4.MessageHeader;
  MolecularSequence: fhir4.MolecularSequence;
  NamingSystem: fhir4.NamingSystem;
  NutritionOrder: fhir4.NutritionOrder;
  Observation: fhir4.Observation;
  ObservationDefinition: fhir4.ObservationDefinition;
  OperationDefinition: fhir4.OperationDefinition;
  OperationOutcome: fhir4.OperationOutcome;
  Organization: fhir4.Organization;
  OrganizationAffiliation: fhir4.OrganizationAffiliation;
  Patient: fhir4.Patient;
  PaymentNotice: fhir4.PaymentNotice;
  PaymentReconciliation: fhir4.PaymentReconciliation;
  Person: fhir4.Person;
  PlanDefinition: fhir4.PlanDefinition;
  Practitioner: fhir4.Practitioner;
  PractitionerRole: fhir4.PractitionerRole;
  Procedure: fhir4.Procedure;
  Provenance: fhir4.Provenance;
  Questionnaire: fhir4.Questionnaire;
  QuestionnaireResponse: fhir4.QuestionnaireResponse;
  RelatedPerson: fhir4.RelatedPerson;
  RequestGroup: fhir4.RequestGroup;
  ResearchDefinition: fhir4.ResearchDefinition;
  ResearchElementDefinition: fhir4.ResearchElementDefinition;
  ResearchStudy: fhir4.ResearchStudy;
  ResearchSubject: fhir4.ResearchSubject;
  RiskAssessment: fhir4.RiskAssessment;
  RiskEvidenceSynthesis: fhir4.RiskEvidenceSynthesis;
  Schedule: fhir4.Schedule;
  SearchParameter: fhir4.SearchParameter;
  ServiceRequest: fhir4.ServiceRequest;
  Slot: fhir4.Slot;
  Specimen: fhir4.Specimen;
  SpecimenDefinition: fhir4.SpecimenDefinition;
  StructureDefinition: fhir4.StructureDefinition;
  StructureMap: fhir4.StructureMap;
  Subscription: fhir4.Subscription;
  Substance: fhir4.Substance;
  SubstanceNucleicAcid: fhir4.SubstanceNucleicAcid;
  SubstancePolymer: fhir4.SubstancePolymer;
  SubstanceProtein: fhir4.SubstanceProtein;
  SubstanceReferenceInformation: fhir4.SubstanceReferenceInformation;
  SubstanceSourceMaterial: fhir4.SubstanceSourceMaterial;
  SubstanceSpecification: fhir4.SubstanceSpecification;
  SupplyDelivery: fhir4.SupplyDelivery;
  SupplyRequest: fhir4.SupplyRequest;
  Task: fhir4.Task;
  TerminologyCapabilities: fhir4.TerminologyCapabilities;
  TestReport: fhir4.TestReport;
  TestScript: fhir4.TestScript;
  ValueSet: fhir4.ValueSet;
  VerificationResult: fhir4.VerificationResult;
  VisionPrescription: fhir4.VisionPrescription;
}

/**
 * Nama-nama resource FHIR yang valid
 */
export type FhirResourceType = keyof FhirResourceMap;

/**
 * Parameter untuk GET request
 */
export interface FhirGetParams {
  /** Path parameter (ID resource) */
  pathParams?: string;
  /** Query parameters untuk search */
  queryParams?: Record<string, string | string[] | number | boolean>;
}

/**
 * Parameter untuk PUT request
 */
export interface FhirPutParams {
  /** Path parameter (ID resource) - wajib untuk PUT */
  pathParams: string;
}
