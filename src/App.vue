<script setup lang="ts">
import SiteHeader from './components/common/SiteHeader.vue'
import SiteFooter from './components/common/SiteFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import ExperienceSection from './sections/ExperienceSection.vue'
import SpecialtiesSection from './sections/SpecialtiesSection.vue'
import ResultsSection from './sections/ResultsSection.vue'
import BeforeAfterSection from './sections/BeforeAfterSection.vue'
import JourneySection from './sections/JourneySection.vue'
import DoctorSection from './sections/DoctorSection.vue'
import ClinicSection from './sections/ClinicSection.vue'
import FinalCTASection from './sections/FinalCTASection.vue'
import { useLenis } from './composables/useLenis'

useLenis()
</script>

<template>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <SiteHeader />
  <main id="conteudo" tabindex="-1">
    <HeroSection />
    <ExperienceSection />
    <SpecialtiesSection />
    <ResultsSection />
    <BeforeAfterSection />
    <JourneySection />
    <DoctorSection />
    <ClinicSection />
    <FinalCTASection />
  </main>
  <SiteFooter />
</template>
