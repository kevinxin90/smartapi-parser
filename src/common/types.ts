export interface XTranslatorObject {
  component: string;
  team: string[];
}

interface SmartAIPInfoObject {
  title: string;
  version: string;
  description?: string;
  'x-translator'?: XTranslatorObject;
  [propName: string]: any;
}

interface SmartAPIServerObject {
  url: string;
  description?: string;
  variables?: any;
  'x-location'?: string;
  'x-maturity': any;
}

interface SmartAPIReferenceObject {
  $ref?: string;
}

export interface SmartAPIParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
}

interface SmartAPIMediaTypeObject {
  example?: any;
  schema?: any;
  examples?: any;
  encoding?: any;
}

interface SmartAPIRequestBodyObject {
  description?: string;
  content: SmartAPIMediaTypeObject[];
  required?: boolean;
}

interface SmartAPIResponsesObject {
  description: string;
  headers: any;
  content: any;
  links: any;
}

export interface SmartAPIOperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: any;
  operationID?: string;
  parameters?: SmartAPIParameterObject[];
  requestBody?: SmartAPIRequestBodyObject | SmartAPIReferenceObject;
  responses?: SmartAPIResponsesObject;
  callbacks?: any;
  deprecated?: boolean;
  security?: any;
  servers?: SmartAPIServerObject[];
  'x-bte-kgs-operations'?: SmartAPIReferenceObject;
  [propName: string]: any;
}

export interface SmartAPIPathItemObject {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: SmartAPIOperationObject;
  [propName: string]: any;
  put?: SmartAPIOperationObject;
  post?: SmartAPIOperationObject;
  delete?: SmartAPIOperationObject;
  options?: SmartAPIOperationObject;
  head?: SmartAPIOperationObject;
  patch?: SmartAPIOperationObject;
  trace?: SmartAPIOperationObject;
  servers?: SmartAPIServerObject[];
  parameters?: SmartAPIParameterObject[] | SmartAPIReferenceObject[];
}

export interface SmartAPIPathsObject {
  [path: string]: SmartAPIPathItemObject;
}

interface SmartAPITagObject {
  name: string;
  description?: string;
  externalDocs?: any;
  'x-id'?: string;
}

export interface SmartAPIComponentObject {
  [propName: string]: any;
}
export interface XBTEKGSOperationBioEntityObject {
  id: string;
  semantic: string;
}

export interface XBTEKGSOperationObject {
  inputs: XBTEKGSOperationBioEntityObject[];
  outputs: XBTEKGSOperationBioEntityObject[];
  predicate: string;
  source?: string;
  parameters?: any;
  requestBody?: any;
  supportBatch?: boolean;
  inputSeparator?: string;
  response_mapping: SmartAPIReferenceObject;
}

export interface SmartAPISpec {
  openapi: string;
  info: SmartAIPInfoObject;
  servers?: SmartAPIServerObject[];
  paths: SmartAPIPathsObject;
  tags?: SmartAPITagObject[];
  security?: any;
  externalDocs?: any;
  components?: SmartAPIComponentObject;
  _id?: string;
  _meta?: string;
}

export interface SmartAPIRegistryRecordObject {
  id: string;
  meta: any;
}

interface KGAssociationObject {
  input_id?: string;
  input_type: string;
  output_id?: string;
  output_type: string;
  predicate: string;
  source?: string;
  api_name?: string;
  smartapi?: SmartAPIRegistryRecordObject;
  'x-translator'?: any;
}

export interface SmartAPIKGOperationObject {
  association: KGAssociationObject;
  query_operation?: any;
  response_mapping?: any;
  id?: string;
  tags?: string[];
}

export interface ParsedAPIMetadataObject {
  title: string;
  tags: string[];
  url: string;
  paths: string[];
  components: any;
  smartapi: SmartAPIRegistryRecordObject;
  'x-translator': XTranslatorObject;
  operations: SmartAPIKGOperationObject[];
}
