import tagRepository from '../repository/tag-repository';

class TagService {
  async prepareTaskTags(tags?: string[]): Promise<{ tagId: number }[]> {
    if (!tags || tags.length === 0) {
      return [];
    }

    //중복 제거
    const normalizedTags = tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0);

    const uniqueTags = [...new Set(normalizedTags)];

    //기존 태그 조회
    const existingTags = await tagRepository.findManyByNames(uniqueTags);

    const existingMap = new Map(existingTags.map((tag) => [tag.name, tag.id]));

    // 새로 만들어야 할 태그 필터링
    const newTagNames = uniqueTags.filter((name) => !existingMap.has(name));

    // 없는 태그 생성
    const createdTags =
      newTagNames.length > 0 ? await tagRepository.createManyByNames(newTagNames) : [];

    // 모든 tagId 수집
    const allTagIds = [...existingTags.map((tag) => tag.id), ...createdTags.map((tag) => tag.id)];

    // 반환
    return allTagIds.map((tagId) => ({ tagId }));
  }
}

export default new TagService();
