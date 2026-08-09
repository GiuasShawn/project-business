import type { z } from '@loom/validation'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

/**
 * Validation pipe that uses an existing Zod schema to validate request bodies.
 *
 * This is the canonical HTTP-boundary validation approach for Project Loom
 * (Phase 04.5). The project already has Zod schemas defined in
 * @loom/validation for every auth DTO. This pipe connects them to NestJS
 * endpoints without requiring class-validator DTOs.
 *
 * Usage:
 * @Body(new ZodValidationPipe(registerSchema))
 *
 * @see docs/adr/ADR-011-REST-API.md
 * @see packages/validation/src/schemas.ts
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodSchema<unknown>) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value)

    if (!result.success) {
      const firstError = result.error.errors[0]
      const message = firstError?.message ?? 'Validation failed'
      const field = firstError?.path?.join('.') ?? 'unknown'

      throw new BadRequestException({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `${field}: ${message}`,
        },
      })
    }

    return result.data
  }
}
