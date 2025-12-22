/**
 * Base class genérica para servicios mock
 * Facilita la migración futura a API real y reduce código duplicado
 * 
 * @template T - Tipo de entidad (Cliente, Proveedor, Budget, etc.)
 * @template CreateInput - Tipo de input para crear entidad
 * @template UpdateInput - Tipo de input para actualizar entidad (opcional)
 */

export interface MockServiceOptions {
  /** Delay en ms para simular latencia de red (default: 500) */
  delay?: number;
  /** Función para generar IDs únicos (default: Date.now().toString()) */
  generateId?: () => string;
}

export abstract class MockServiceBase<T extends { id: string }, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  protected data: T[] = [];
  protected delay: number;
  protected generateId: () => string;

  constructor(initialData: T[] = [], options: MockServiceOptions = {}) {
    this.data = [...initialData];
    this.delay = options.delay ?? 500;
    this.generateId = options.generateId ?? (() => Date.now().toString() + Math.random().toString(36).substr(2, 9));
  }

  /**
   * Simula delay de red
   */
  protected async simulateDelay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  /**
   * Convierte CreateInput en entidad T
   * @abstract Debe ser implementado por la clase hija
   */
  protected abstract mapCreateInputToEntity(input: CreateInput): T;

  /**
   * Valida input de creación
   * @abstract Debe ser implementado por la clase hija (puede ser vacío si no hay validación)
   */
  protected abstract validateCreateInput(input: CreateInput): void;

  /**
   * Valida input de actualización
   * Override en clase hija si necesita validación personalizada
   */
  protected validateUpdateInput(_input: UpdateInput): void {
    // Implementación por defecto: sin validación
  }

  /**
   * Obtener todos los registros
   */
  async getAll(): Promise<T[]> {
    await this.simulateDelay();
    return [...this.data];
  }

  /**
   * Obtener registro por ID
   */
  async getById(id: string): Promise<T | null> {
    await this.simulateDelay();
    const item = this.data.find((item) => item.id === id);
    return item ? { ...item } : null;
  }

  /**
   * Crear nuevo registro
   */
  async create(input: CreateInput): Promise<T> {
    this.validateCreateInput(input);
    await this.simulateDelay();

    const newItem = this.mapCreateInputToEntity(input);
    this.data.push(newItem);
    
    return { ...newItem };
  }

  /**
   * Actualizar registro existente
   */
  async update(id: string, input: UpdateInput): Promise<T> {
    this.validateUpdateInput(input);
    await this.simulateDelay();

    const index = this.data.findIndex((item) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Registro con ID ${id} no encontrado`);
    }

    const updatedItem = {
      ...this.data[index],
      ...input,
      id, // Asegurar que el ID no cambie
    };

    this.data[index] = updatedItem;
    return { ...updatedItem };
  }

  /**
   * Eliminar registro
   */
  async delete(id: string): Promise<void> {
    await this.simulateDelay();

    const index = this.data.findIndex((item) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Registro con ID ${id} no encontrado`);
    }

    this.data.splice(index, 1);
  }

  /**
   * Búsqueda genérica
   * Override en clase hija para implementar búsqueda específica
   */
  async search(query: string, fields?: (keyof T)[]): Promise<T[]> {
    await this.simulateDelay();

    if (!query) {
      return [...this.data];
    }

    const queryLower = query.toLowerCase();
    
    return this.data.filter((item) => {
      if (fields && fields.length > 0) {
        // Buscar en campos específicos
        return fields.some((field) => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(queryLower);
        });
      }
      
      // Buscar en todos los campos string
      return Object.values(item).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(queryLower)
      );
    });
  }

  /**
   * Filtrado genérico
   * Override en clase hija para filtros más complejos
   */
  async filter(predicate: (item: T) => boolean): Promise<T[]> {
    await this.simulateDelay();
    return this.data.filter(predicate);
  }

  /**
   * Conteo de registros
   */
  async count(): Promise<number> {
    await this.simulateDelay();
    return this.data.length;
  }

  /**
   * Verificar si existe un registro
   */
  async exists(id: string): Promise<boolean> {
    await this.simulateDelay();
    return this.data.some((item) => item.id === id);
  }

  /**
   * Batch create - crear múltiples registros
   */
  async createMany(inputs: CreateInput[]): Promise<T[]> {
    const results: T[] = [];
    
    for (const input of inputs) {
      this.validateCreateInput(input);
      const newItem = this.mapCreateInputToEntity(input);
      this.data.push(newItem);
      results.push({ ...newItem });
    }

    await this.simulateDelay();
    return results;
  }

  /**
   * Batch delete - eliminar múltiples registros
   */
  async deleteMany(ids: string[]): Promise<void> {
    await this.simulateDelay();
    
    this.data = this.data.filter((item) => !ids.includes(item.id));
  }

  /**
   * Resetear datos al estado inicial
   */
  reset(initialData: T[]): void {
    this.data = [...initialData];
  }

  /**
   * Obtener copia de los datos actuales (útil para debugging)
   */
  getCurrentData(): T[] {
    return [...this.data];
  }
}

/**
 * Ejemplo de uso:
 * 
 * ```typescript
 * class ClienteService extends MockServiceBase<Cliente, CreateClienteInput> {
 *   constructor() {
 *     super(MOCK_CLIENTES, { delay: 600 });
 *   }
 * 
 *   protected mapCreateInputToEntity(input: CreateClienteInput): Cliente {
 *     return {
 *       id: this.generateId(),
 *       ...input,
 *       activo: true,
 *       createdAt: new Date().toISOString(),
 *       updatedAt: new Date().toISOString(),
 *     };
 *   }
 * 
 *   protected validateCreateInput(input: CreateClienteInput): void {
 *     if (!input.rut) throw new Error("RUT es requerido");
 *     if (!input.email) throw new Error("Email es requerido");
 *   }
 * 
 *   // Métodos específicos del servicio
 *   async getByRut(rut: string): Promise<Cliente | null> {
 *     await this.simulateDelay();
 *     return this.data.find(c => c.rut === rut) || null;
 *   }
 * }
 * ```
 */
