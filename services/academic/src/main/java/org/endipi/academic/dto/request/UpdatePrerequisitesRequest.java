package org.endipi.academic.dto.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePrerequisitesRequest {
    private Long courseId;
    private List<Long> prerequisiteIdsToAdd;
    private List<Long> prerequisiteIdsToRemove;
} 