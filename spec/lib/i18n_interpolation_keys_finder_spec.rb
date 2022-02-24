# frozen_string_literal: true

require 'rails_helper'

RSpec.describe I18nInterpolationKeysFinder do
  describe '#find' do
    it 'should return the right keys' do
      expect(described_class.find('%{first} %{second} {{third}}'))
        .to eq(['first', 'second', 'third'])
    end
  end
end
