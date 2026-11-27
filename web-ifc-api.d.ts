/**
 * Web-IFC Main API Class
 * @module web-ifc
 */
import { IfcLineObject } from "./ifc-schema";
export * from "./ifc-schema";
import { Properties } from "./helpers/properties";
export { Properties };
import { LogLevel } from "./helpers/log";
export { LogLevel };
export declare const UNKNOWN = 0;
export declare const STRING = 1;
export declare const LABEL = 2;
export declare const ENUM = 3;
export declare const REAL = 4;
export declare const REF = 5;
export declare const EMPTY = 6;
export declare const SET_BEGIN = 7;
export declare const SET_END = 8;
export declare const LINE_END = 9;
export declare const INTEGER = 10;
/** STEP binary literal contents, including the unused-bit prefix (0-3).
 * Up to 2^32-1 characters; lowercase hex is accepted and saved as uppercase.
 */
export declare const BINARY = 11;
/**
 * PlacedGeometry.geomType value for a regular triangle mesh.
 */
export declare const GEOM_TRIANGLES = 0;
/**
 * PlacedGeometry.geomType value for wireframe geometry (IfcPolyline,
 * IfcIndexedPolyCurve, IfcCircle, IfcEdge, ...): the vertices form a connected
 * polyline strip that has to be drawn with line primitives instead of triangles.
 */
export declare const GEOM_LINE_STRIP = 1;
/**
 * PlacedGeometry.geomType value for independent points (IfcCartesianPoint and
 * IfcCartesianPointList representation items): draw with point primitives.
 */
export declare const GEOM_POINTS = 2;
/**
 * Settings for the IFCLoader
 * @property {boolean} COORDINATE_TO_ORIGIN - If true, the model will be translated to the origin.
 * @property {number} CIRCLE_SEGMENTS - Number of segments used to approximate circles.
 * @property {number} MEMORY_LIMIT - Maximum memory (in bytes) to be reserved for IFC data in memory.
 * @property {number} TAPE_SIZE - Size of the internal buffer tape for the loader (in bytes or units).
 * @property {number} LINEWRITER_BUFFER - Number of lines to write to memory at a time when writing an IFC file.
 * @property {number} TOLERANCE_PLANE_INTERSECTION - Numerical tolerance when checking plane intersections.
 * @property {number} TOLERANCE_PLANE_DEVIATION - Tolerance to consider a plane on a boundary.
 * @property {number} TOLERANCE_BACK_DEVIATION_DISTANCE - Used to determine if a point lies in front or behind a plane based on normal orientation.
 * @property {number} TOLERANCE_INSIDE_OUTSIDE_PERIMETER - Tolerance for point-in-perimeter calculations.
 * @property {number} TOLERANCE_SCALAR_EQUALITY - Tolerance used to compare scalar values as equal.
 * @property {number} PLANE_REFIT_ITERATIONS - Number of iterations used when adjusting triangles to a plane.
 * @property {number} BOOLEAN_UNION_THRESHOLD - Minimum number of solids before triggering a boolean union operation.
 * @property {boolean} EXPORT_POLYLINES - Export wireframe (curve/point) geometry of products without solid geometry. Defaults to false.
 */
export interface LoaderSettings {
    /** Allow best-effort parsing of older/preview schemas using incompatible generated layouts.
     * Defaults to true for backward compatibility. Set false to reject these aliases.
     * This does not provide full support for the named schema.
     */
    ALLOW_INCOMPATIBLE_SCHEMA_ALIASES?: boolean;
    COORDINATE_TO_ORIGIN?: boolean;
    CIRCLE_SEGMENTS?: number;
    MEMORY_LIMIT?: number;
    TAPE_SIZE?: number;
    LINEWRITER_BUFFER?: number;
    TOLERANCE_PLANE_INTERSECTION?: number;
    TOLERANCE_PLANE_DEVIATION?: number;
    TOLERANCE_BACK_DEVIATION_DISTANCE?: number;
    TOLERANCE_INSIDE_OUTSIDE_PERIMETER?: number;
    TOLERANCE_SCALAR_EQUALITY?: number;
    PLANE_REFIT_ITERATIONS?: number;
    BOOLEAN_UNION_THRESHOLD?: number;
    /**
     * Export wireframe (curve/point) geometry of products that carry no solid
     * geometry at all, e.g. IfcAnnotation Curve3D representations, IfcGrid or
     * IfcGeometricCurveSet (defaults to false). Products that also carry solid
     * geometry keep exporting triangles only. Set to true to also receive
     * wireframe geometry.
     */
    EXPORT_POLYLINES?: boolean;
}
export interface Vector<T> extends Iterable<T> {
    get(index: number): T;
    size(): number;
}
export interface Color {
    x: number;
    y: number;
    z: number;
    w: number;
}
export interface RawLineData {
    ID: number;
    type: number;
    arguments: any[];
}
export interface PlacedGeometry {
    color: Color;
    /** False when neither the element nor any of its sub-items carries an IFC
     * style; color is then a neutral default rather than a material. */
    hasColor: boolean;
    /**
     * GEOM_TRIANGLES (0), GEOM_LINE_STRIP (1) or GEOM_POINTS (2). Non-triangle
     * geometry is only produced for products whose representation contains no
     * solid or face geometry (e.g. IfcAnnotation Curve3D representations).
     */
    geomType: number;
    geometryExpressID: number;
    flatTransformation: Array<number>;
}
export interface FlatMesh {
    geometries: Vector<PlacedGeometry>;
    expressID: number;
    delete(): void;
}
/** A Body item the brep engine built (see IfcAPI.StreamAllBrepMeshes). */
export interface BrepShell {
    id: number;
    points: Float64Array;
    rings: Int32Array;
}
export interface Point {
    x: number;
    y: number;
    z?: number;
}
export interface Curve {
    points: Array<Point>;
    userData: Array<string>;
    arcSegments: Array<number>;
}
export interface SweptDiskSolid {
    profile: Profile;
    axis: Array<Curve>;
    profileRadius: number;
}
/** An IfcSweptDiskSolid read without meshing it (see IfcAPI.GetSweptDiskAxes). */
export interface SweptDiskAxis {
    /** The IfcSweptDiskSolid item, as PlacedGeometry.geometryExpressID. */
    geometryExpressID: number;
    /** As PlacedGeometry.color. */
    color: Color;
    /** As PlacedGeometry.flatTransformation (column-major 4x4). */
    flatTransformation: Float64Array;
    /** The directrix the sweep follows, x y z per point, in the item's frame (as SweptDiskSolid.axis). */
    points: Float64Array;
    radius: number;
    innerRadius: number;
}
export interface Profile {
    curve: Curve;
    holes: Array<Curve>;
    profiles: Array<Profile>;
    isConvex: boolean;
    isComposite: boolean;
}
export interface CrossSection {
    curves: Array<Curve>;
    expressID: Array<number>;
}
export interface AlignmentSegment {
    curves: Array<Curve>;
}
export interface Alignment {
    FlatCoordinationMatrix: Array<number>;
    Horizontal: AlignmentSegment;
    Vertical: AlignmentSegment;
    Absolute: AlignmentSegment;
}
export interface IfcGeometry {
    GetVertexData(): number;
    GetVertexDataSize(): number;
    GetIndexData(): number;
    GetIndexDataSize(): number;
    GetSweptDiskSolid(): SweptDiskSolid;
    delete(): void;
}
export interface Buffers {
    fvertexData: Array<number>;
    indexData: Array<number>;
}
export interface AABB {
    GetBuffers(): Buffers;
    SetValues(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void;
}
export interface Extrusion {
    GetBuffers(): Buffers;
    SetValues(profile_: Array<number>, dir_: Array<number>, len_: number, cuttingPlaneNormal_: Array<number>, cuttingPlanePos_: Array<number>, cap_: boolean): void;
    SetHoles(profile_: Array<number>): void;
    ClearHoles(): void;
}
export interface Sweep {
    GetBuffers(): Buffers;
    SetValues(scaling: number, closed: boolean, profile: Array<number>, directrix: Array<number>, initialNormal?: Array<number>, rotate90?: boolean, optimize?: boolean): void;
}
export interface CircularSweep {
    GetBuffers(): Buffers;
    SetValues(scaling: number, closed: boolean, profile: Array<number>, radius: number, directrix: Array<number>, initialNormal?: Array<number>, rotate90?: boolean): void;
}
export interface Revolution {
    GetBuffers(): Buffers;
    SetValues(profile_: Array<number>, transform_: Array<number>, startDegrees_: number, endDegrees_: number, numRots_: number): void;
}
export interface CylindricalRevolve {
    GetBuffers(): Buffers;
    SetValues(transform_: Array<number>, startDegrees_: number, endDegrees_: number, minZ_: number, maxZ_: number, numRots_: number, radius_: number): void;
}
export interface Parabola {
    GetBuffers(): Buffers;
    SetValues(segments: number, startPointX: number, startPointY: number, startPointZ: number, horizontalLength: number, startHeight: number, startGradient: number, endGradient: number): void;
}
export interface Clothoid {
    GetBuffers(): Buffers;
    SetValues(segments: number, startPointX: number, startPointY: number, startPointZ: number, ifcStartDirection: number, StartRadiusOfCurvature: number, EndRadiusOfCurvature: number, SegmentLength: number): void;
}
export interface Arc {
    GetBuffers(): Buffers;
    SetValues(radiusX: number, radiusY: number, numSegments: number, placement: Array<number>, startRad?: number, endRad?: number, swap?: boolean, normalToCenterEnding?: boolean): void;
}
export interface Alignment {
    GetBuffers(): Buffers;
    SetValues(horizontal: Array<number>, vertical: Array<number>): void;
}
export interface BooleanOperator {
    GetBuffers(): Buffers;
    SetValues(triangles_: Array<number>, type_: string): void;
    SetSecond(triangles_: Array<number>): void;
    clear(): void;
}
export interface ProfileSection {
    GetBuffers(): Buffers;
    SetValues(pType: number, width: number, depth: number, webThickness: number, flangeThickness: number, hasFillet: boolean, filletRadius: number, radius: number, slope: number, circleSegments: number, placement: Array<number>): void;
}
/** A plane through `point` with normal `normal` (see SectionMesh / GetSection). */
export interface SectionPlane {
    point: ArrayLike<number>;
    normal: ArrayLike<number>;
}
export interface SectionOptions {
    /** distance under which two cut points are the same point */
    weld?: number;
    /** largest gap closed between the ends of chains that do not close (0 = never) */
    closeGap?: number;
}
export interface SectionResult {
    /** x, y, z per cap vertex */
    capPositions: Float64Array;
    /** 3 per cap triangle */
    capIndices: Uint32Array;
    /** x1, y1, z1, x2, y2, z2 per cut segment */
    lines: Float64Array;
    closedLoops: number;
    closedByGap: number;
    openChains: number;
    earcutFailures: number;
}
export interface IfcType {
    typeID: number;
    typeName: string;
}
export interface NewIfcModel {
    schema: string;
    name?: string;
    description?: string[];
    authors?: string[];
    organizations?: string[];
    authorization?: string;
}
export type ModelLoadCallback = (offset: number, size: number) => Uint8Array;
export type ModelSaveCallback = (data: Uint8Array) => void;
/** @ignore */
export declare function ms(): number;
export type LocateFileHandlerFn = (path: string, prefix: string) => string;
export declare class IfcAPI {
    /** @ignore */
    wasmModule: undefined | any;
    private wasmPath;
    private isWasmPathAbsolute;
    private modelSchemaList;
    private modelSchemaNameList;
    /** @ignore */
    ifcGuidMap: Map<number, Map<string | number, string | number>>;
    private deletedLines;
    /**
     * Contains all the logic and methods regarding properties, psets, qsets, etc.
     */
    properties: Properties;
    /**
     * Initializes the WASM module (WebIFCWasm), required before using any other functionality.
     *
     * @param customLocateFileHandler An optional locateFile function that let's
     * you override the path from which the wasm module is loaded.
     */
    Init(customLocateFileHandler?: LocateFileHandlerFn, forceSingleThread?: boolean): Promise<void>;
    /**
     * Opens a set of models and returns model IDs
     * @param dataSets Array of Buffers containing IFC data (bytes)
     * @param settings Settings for loading the model @see LoaderSettings
     * @returns Array of model IDs
     */
    OpenModels(dataSets: Array<Uint8Array>, settings?: LoaderSettings): Array<number>;
    private CreateSettings;
    private LookupSchemaId;
    /**
     * Opens a model and returns a modelID number
     * @param data Buffer containing IFC data (bytes)
     * @param settings Settings for loading the model @see LoaderSettings
     * @returns ModelID or -1 if model fails to open
     */
    OpenModel(data: Uint8Array, settings?: LoaderSettings): number;
    /**
     * Opens a model and returns a modelID number
     * @param callback a function of signature (offset:number, size: number) => Uint8Array that will retrieve the IFC data
     * @param settings Settings for loading the model @see LoaderSettings
     * @returns ModelID or -1 if model fails to open
     */
    OpenModelFromCallback(callback: ModelLoadCallback, settings?: LoaderSettings): number;
    /**
     * Fetches the ifc schema version of a given model
     * @param modelID Model ID
     * @returns IFC Schema version
     */
    GetModelSchema(modelID: number): string;
    /**
     * Creates a new model and returns a modelID number
     * @param schema ifc schema version
     * @returns ModelID
     */
    CreateModel(model: NewIfcModel, settings?: LoaderSettings): number;
    /**
     * Saves a model to a Buffer
     * @param modelID Model ID
     * @returns Buffer containing the model data
     */
    SaveModel(modelID: number): Uint8Array;
    /**
     * Saves a model to a Buffer
     * @param modelID Model ID
     * @returns Buffer containing the model data
     */
    SaveModelToCallback(modelID: number, callback: ModelSaveCallback): void;
    /**
     * Retrieves the geometry of an element
     * @param modelID Model handle retrieved by OpenModel
     * @param geometryExpressID express ID of the element
     * @returns Geometry of the element as a list of vertices and indices
     */
    GetGeometry(modelID: number, geometryExpressID: number): IfcGeometry;
    CreateAABB(): any;
    CreateExtrusion(): any;
    CreateSweep(): any;
    CreateCircularSweep(): any;
    CreateRevolution(): any;
    CreateCylindricalRevolution(): any;
    CreateParabola(): any;
    CreateClothoid(): any;
    CreateArc(): any;
    CreateAlignment(): any;
    CreateBooleanOperator(): any;
    CreateProfile(): any;
    /**
     * Gets the header information required by the user
     * @param modelID Model handle retrieved by OpenModel
     * @param headerType Type of header data you want to retrieve
     * ifc.FILE_NAME, ifc.FILE_DESCRIPTION or ifc.FILE_SCHEMA
     * @returns An object with parameters ID, type and arguments
     */
    GetHeaderLine(modelID: number, headerType: number): any;
    /**
     * Gets the list of all ifcTypes contained in the model
     * @param modelID Model handle retrieved by OpenModel
     * @returns Array of objects containing typeID and typeName
     */
    GetAllTypesOfModel(modelID: number): IfcType[];
    /**
     * Gets the ifc line data for a given express ID
     * @param modelID Model handle retrieved by OpenModel
     * @param expressID express ID of the line
     * @param flatten recursively flatten the line, default false
     * @param inverse get the inverse properties of the line, default false
     * @param inversePropKey filters out all other properties from a inverse search, for a increase in performance. Default null
     * @returns lineObject
     */
    GetLine(modelID: number, expressID: number, flatten?: boolean, inverse?: boolean, inversePropKey?: string | null | undefined): any;
    /**
     * Gets the ifc line data for a given express ID
     * @param modelID Model handle retrieved by OpenModel
     * @param a list of expressID express ID of the line
     * @param flatten recursively flatten the line, default false
     * @param inverse get the inverse properties of the line, default false
     * @param inversePropKey filters out all other properties from a inverse search, for a increase in performance. Default null
     * @returns lineObject
     */
    GetLines(modelID: number, expressIDs: Array<number>, flatten?: boolean, inverse?: boolean, inversePropKey?: string | null | undefined): any[];
    /**
     * Gets the next unused expressID
     * @param modelID Model handle retrieved by OpenModel
     * @param expressID Starting expressID value
     * @returns The next unused expressID starting from the value provided
     */
    GetNextExpressID(modelID: number, expressID: number): number;
    /**
     * Creates a new ifc entity
     * @param modelID Model handle retrieved by OpenModel
     * @param type Type code
     * @param args Arguments required by the entity
     * @returns An object contining the parameters of the new entity
     */
    CreateIfcEntity(modelID: number, type: number, ...args: any[]): IfcLineObject;
    /**
     * Creates a new ifc globally unqiue ID
     * @param modelID Model handle retrieved by OpenModel
     * @returns An randomly generated globally unique ID
     */
    CreateIFCGloballyUniqueId(modelID: number): any;
    /**
     * Creates a new ifc type i.e. IfcLabel, IfcReal, ...
     * @param modelID Model handle retrieved by OpenModel
     * @param type Type code
     * @param value Type value
     * @returns An object with the parameters of the type
     */
    CreateIfcType(modelID: number, type: number, value: any): any;
    /**
     * Gets the name from a type code
     * @param type Code
     * @returns Name
     */
    GetNameFromTypeCode(type: number): string;
    /**
     * Gets the type code  from a name code
     * @param name
     * @returns type code
     */
    GetTypeCodeFromName(typeName: string): number;
    /**
     * Evaluates if a type is subtype of IfcElement
     * @param type Type code
     * @returns True if subtype of Ifcelement, False if it is not subtype
     */
    IsIfcElement(type: number): boolean;
    /**
     * Returns a list with all entity types that are present in the current schema
     * @param modelID Model handle retrieved by OpenModel
     * @returns Array of type codes
     */
    GetIfcEntityList(modelID: number): Array<number>;
    /**
     * Deletes an IFC line from the model
     * @param modelID Model handle retrieved by OpenModel
     * @param expressID express ID of the line to remove
     */
    DeleteLine(modelID: number, expressID: number): void;
    /**
     * Writes a line to the model, can be used to write new lines or to update existing lines
     * @param modelID Model handle retrieved by OpenModel
     * @param lineObject array of line object to write
     */
    WriteLines<Type extends IfcLineObject>(modelID: number, lineObjects: Array<Type>): void;
    /**
     * Writes a set of line to the model, can be used to write new lines or to update existing lines
     * @param modelID Model handle retrieved by OpenModel
     * @param lineObject line object to write
     */
    WriteLine<Type extends IfcLineObject>(modelID: number, lineObject: Type): void;
    /** @ignore */
    FlattenLine(modelID: number, line: any): void;
    /** @ignore */
    GetRawLinesData(modelID: number, expressIDs: Array<number>): Array<RawLineData>;
    /** @ignore */
    GetRawLineData(modelID: number, expressID: number): RawLineData;
    /** @ignore */
    WriteRawLineData(modelID: number, data: RawLineData): void;
    /** @ignore */
    WriteRawLinesData(modelID: number, data: Array<RawLineData>): void;
    /**
     * Get all line IDs of a specific ifc type
     * @param modelID model ID
     * @param type ifc type, @see IfcEntities
     * @param includeInherited if true, also returns all inherited types
     * @returns vector of line IDs
     */
    GetLineIDsWithType(modelID: number, type: number, includeInherited?: boolean): Vector<number>;
    /**
     * Get all line IDs of a model
     * @param modelID model ID
     * @returns vector of all line IDs
     */
    GetAllLines(modelID: number): Vector<number>;
    /**
     * Returns all crossSections in 2D contained in IFCSECTIONEDSOLID, IFCSECTIONEDSURFACE, IFCSECTIONEDSOLIDHORIZONTAL (IFC4x3 or superior)
     * @param modelID model ID
     * @returns Lists with the cross sections curves as sets of points
     */
    GetAllCrossSections2D(modelID: number): Array<CrossSection>;
    /**
     * Returns all crossSections in 3D contained in IFCSECTIONEDSOLID, IFCSECTIONEDSURFACE, IFCSECTIONEDSOLIDHORIZONTAL (IFC4x3 or superior)
     * @param modelID model ID
     * @returns Lists with the cross sections curves as sets of points
     */
    GetAllCrossSections3D(modelID: number): Array<CrossSection>;
    /**
     * Returns all alignments contained in the IFC model (IFC4x3 or superior)
     * @param modelID model ID
     * @returns Lists with horizontal and vertical curves as sets of points
     */
    GetAllAlignments(modelID: number): any;
    /**
     * Set the transformation matrix
     * @param modelID model ID
     * @param transformationMatrix transformation matrix, flat 4x4 matrix as array[16]
     */
    SetGeometryTransformation(modelID: number, transformationMatrix: Array<number>): void;
    /**
     * Get the coordination matrix
     * @param modelID model ID
     * @returns flat 4x4 matrix as array[16]
     */
    GetCoordinationMatrix(modelID: number): Array<number>;
    GetWorldTransformMatrix(modelID: number, placementExpressId: number): Array<number>;
    GetVertexArray(ptr: number, size: number): Float32Array;
    GetIndexArray(ptr: number, size: number): Uint32Array;
    getSubArray(heap: any, startPtr: number, sizeBytes: number): any;
    /**
     * Closes a model and frees all related memory
     * @param modelID Model handle retrieved by OpenModel, model must be closed after use
     */
    CloseModel(modelID: number): void;
    /**
     * Closes all models and frees all related memory. Please note that after calling this you must call Init() again to ensure web-ifc is in a working state.
     */
    Dispose(): void;
    /**
     * Streams meshes of a model with specific express id
     * @param modelID Model handle retrieved by OpenModel
     * @param expressIDs expressIDs of elements to stream
     * @param meshCallback callback function that is called for each mesh
     * @param applyLinearScalingFactor Whether to apply the model's linear scaling factor to the geometry (default: true)
     */
    StreamMeshes(modelID: number, expressIDs: Array<number>, meshCallback: (mesh: FlatMesh, index: number, total: number) => void, applyLinearScalingFactor?: boolean): void;
    /**
     * Streams all meshes of a model
     * @param modelID Model handle retrieved by OpenModel
     * @param meshCallback callback function that is called for each mesh
     * @param applyLinearScalingFactor Whether to apply the model's linear scaling factor to the geometry (default: true)
     */
    StreamAllMeshes(modelID: number, meshCallback: (mesh: FlatMesh, index: number, total: number) => void, applyLinearScalingFactor?: boolean): void;
    /**
     * As StreamAllMeshes, with the brep kernel as the geometry engine (builds with BREP_ENGINE only).
     * Each Body item the kernel builds comes as a shell instead of a mesh: its geometry in `mesh` has no
     * vertices, and `shells` holds `{ id, points, rings }` for it -- points in file units, in the frame
     * the geometry's flatTransformation places; `rings` per face: ring count, then each ring's length
     * and point indices, the first ring the outer one. The arrays view wasm memory and are valid
     * during the callback only. Anything the kernel does not build comes as an ordinary mesh.
     */
    StreamAllBrepMeshes(modelID: number, meshCallback: (mesh: FlatMesh, shells: BrepShell[], index: number, total: number) => void): void;
    /** As StreamMeshes, with the brep kernel as the geometry engine. See StreamAllBrepMeshes. */
    StreamBrepMeshes(modelID: number, expressIDs: Array<number>, meshCallback: (mesh: FlatMesh, shells: BrepShell[], index: number, total: number) => void): void;
    /**
     * The swept disks of a product (e.g. reinforcing bars) without meshing them: per IfcSweptDiskSolid item,
     * its placement and colour as StreamMeshes would give them, the directrix it is swept along (any curve:
     * arcs and trims evaluated as for the mesh) and its radius. No tube is built and nothing stays cached.
     * Other items of the product are not returned.
     */
    GetSweptDiskAxes(modelID: number, productID: number): SweptDiskAxis[];
    /** Whether this build carries the brep geometry engine. */
    HasBrepEngine(): boolean;
    /**
     * The brep engine on booleans only: Body items that are IfcBooleanResult / IfcBooleanClippingResult
     * (or belong to a product with openings) go to the brep kernel, everything else is meshed by
     * web-ifc as with StreamMeshes, keeping its shared geometries.
     */
    SetBrepBooleansOnly(modelID: number, on: boolean): void;
    /**
     * Streams all meshes of a model with a specific ifc type
     * @param modelID Model handle retrieved by OpenModel
     * @param types types of elements to stream
     * @param meshCallback callback function that is called for each mesh
     * @param applyLinearScalingFactor Whether to apply the model's linear scaling factor to the geometry (default: true)
     */
    StreamAllMeshesWithTypes(modelID: number, types: Array<number>, meshCallback: (mesh: FlatMesh, index: number, total: number) => void, applyLinearScalingFactor?: boolean): void;
    /**
     * Checks if a specific model ID is open or closed
     * @param modelID Model handle retrieved by OpenModel
     * @returns true if model is open, false if model is closed
     */
    IsModelOpen(modelID: number): boolean;
    /**
     * Load all geometry in a model
     * @param modelID Model handle retrieved by OpenModel
     * @param applyLinearScalingFactor Whether to apply the model's linear scaling factor to the geometry (default: true)
     * @returns Vector of FlatMesh objects
     */
    LoadAllGeometry(modelID: number, applyLinearScalingFactor?: boolean): Vector<FlatMesh>;
    /**
     * Load geometry for a single element
     * @param modelID Model handle retrieved by OpenModel
     * @param expressID ExpressID of the element
     * @param applyLinearScalingFactor Whether to apply the model's linear scaling factor to the geometry (default: true)
     * @returns FlatMesh object
     */
    GetFlatMesh(modelID: number, expressID: number, applyLinearScalingFactor?: boolean): FlatMesh;
    /**
     * Returns the maximum ExpressID value in the IFC file, ex.- #9999999
     * @param modelID Model handle retrieved by OpenModel
     * @returns Express numerical value
     */
    GetMaxExpressID(modelID: number): number;
    /**
     * Returns the type of a given ifc entity in the fiule.
     * @param modelID Model handle retrieved by OpenModel
     * @param expressID Line Number
     * @returns IFC Type Code
     */
    GetLineType(modelID: number, expressID: number): any;
    /**
     * Returns the version number of web-ifc
     * @returns The current version number as a string
     */
    GetVersion(): any;
    /**
     * Looks up an entities express ID from its GlobalID.
     * @param modelID Model handle retrieved by OpenModel
     * @param guid GobalID to be looked up
     * @returns expressID numerical value
     */
    GetExpressIdFromGuid(modelID: number, guid: string): string | number | undefined;
    /**
     * Looks up an entities GlobalID from its ExpressID.
     * @param modelID Model handle retrieved by OpenModel
     * @param expressID express ID to be looked up
     * @returns globalID string value
     */
    GetGuidFromExpressId(modelID: number, expressID: number): string | number | undefined;
    /** @ignore */
    CreateIfcGuidToExpressIdMapping(modelID: number): void;
    /**
     * Sets the path to the wasm file
     * @param path path to the wasm file
     * @param absolute if true, path is absolute, otherwise it is relative to executing script
     */
    SetWasmPath(path: string, absolute?: boolean): void;
    /**
     * Sets the log level
     * @param level Log level to set
     */
    SetLogLevel(level: LogLevel): void;
    /**
     * Registers an external boolean engine used as a RESERVE: web-ifc always runs its own boolean chain first; only when
     * the result of a chain has open (naked) edges is the whole chain redone with this function, and the result with
     * fewer naked edges is kept (tie → web-ifc). If the function throws or returns an invalid mesh, web-ifc's result
     * is kept. Pass null to unregister.
     * The function is called synchronously as fn(op, A, B, { unitToMetre }) with op 'DIFFERENCE' | 'UNION' and
     * A/B = { positions: Float64Array (x,y,z in model units), indices: Uint32Array }; it must return { positions, indices }.
     * Counters: globalThis.__morphBoolStats (chainsChecked, chainsOpen, chainsRedone, chainsKeptGeokernel,
     * chainsKeptWebifc, geokernelFails, calls, ok, fallback, ms).
     * BY DEFAULT the bundled geokernel is registered by Init(); call SetBooleanFallback(null) to disable it (pure
     * web-ifc), or pass another function to replace it.
     * @param fn the external boolean function, or null
     */
    SetBooleanFallback(fn: ((op: 'DIFFERENCE' | 'UNION', a: {
        positions: Float64Array;
        indices: Uint32Array;
    }, b: {
        positions: Float64Array;
        indices: Uint32Array;
    }, opts: {
        unitToMetre: number;
    }) => {
        positions: Float64Array | number[];
        indices: Uint32Array | number[];
    }) | null): void;
    private booleanFallbackChosen;
    /**
     * Section of one triangle mesh by a plane: the cut lines and the cut area (cap), triangulated. The mesh is not
     * modified (hiding the part in front of the plane is up to the viewer, e.g. a clipping plane).
     * Tolerant of real-world meshes: flipped triangles do not matter, loops are nested by containment (holes are
     * kept), chains that do not close are closed when their ends are nearer than `closeGap`, and whatever stays
     * open is returned as lines only (counted in `openChains`).
     * @param positions x, y, z per vertex (any frame, any units)
     * @param indices 3 per triangle
     * @param plane the plane, through `point` with normal `normal`, in the same frame as the positions
     * @param options weld: distance under which two cut points are the same (default 1e-6); closeGap: largest gap
     * closed between the ends of open chains (default 0 = never)
     * @returns capPositions (x, y, z) + capIndices, lines (x1, y1, z1, x2, y2, z2 per segment) and counters
     */
    SectionMesh(positions: ArrayLike<number>, indices: ArrayLike<number>, plane: SectionPlane, options?: SectionOptions): SectionResult;
    /**
     * Section (or floor plan, with a horizontal plane) of a whole model: every element whose geometry the plane
     * crosses, cut as one mesh (all its pieces, placed). Coordinates are web-ifc's model frame (Y up, metres when
     * applyLinearScalingFactor is true, the same frame as StreamAllMeshes + flatTransformation).
     * @param modelID Model handle retrieved by OpenModel
     * @param plane the plane, in the model frame
     * @param options see SectionMesh (default weld 1e-5, closeGap 1e-3 here: model units after scaling)
     * @returns one entry per element crossed, with its expressID and the colour of its first piece
     */
    GetSection(modelID: number, plane: SectionPlane, options?: SectionOptions): Array<SectionResult & {
        expressID: number;
        color: Color;
    }>;
    /**
     * Encodes test using IFC Encoding
     * @text the text to encode
     * @returns the text encoded
     */
    EncodeText(text: string): any;
    /**
     * Decodes test using IFC Encoding
     * @text the text to decode
     * @returns the text decoded
     */
    DecodeText(text: string): any;
    /**
     * Resets the Cached IFC Data - useful when changing the geometry of a model
     * @param modelID Model handle retrieved by OpenModel
     */
    ResetCache(modelID: number): any;
}
